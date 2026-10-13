#!/usr/bin/env python3
"""Pokémon drop watcher.

Two jobs:

1. Queue watch: poll retailer pages (Pokémon Center, Costco, Sam's Club, ...)
   and push an alert the moment a virtual queue / waiting room goes up.
2. Drawing (raffle) watch: read announcement pages (Walmart Collectibles
   Drawing coverage, Target, ...), pull out the start time, record it, and
   push reminders before the entry window opens.

Standard library only. Playwright is optional (``--browser``) for sites that
block plain HTTP clients.

Notifications go to ntfy (phone push, no account needed) and/or a Discord
webhook, configured with environment variables:

    NTFY_TOPIC           e.g. "puneeth-drops-8f3k2"  (pick something unguessable)
    NTFY_SERVER          default https://ntfy.sh
    NTFY_TOKEN           optional, for a protected topic
    DISCORD_WEBHOOK_URL  optional
"""

from __future__ import annotations

import argparse
import hashlib
import html
import json
import os
import random
import re
import sys
import time
import tomllib
import urllib.error
import urllib.request
from dataclasses import dataclass, field
from datetime import datetime, timedelta, timezone
from pathlib import Path
from zoneinfo import ZoneInfo

HERE = Path(__file__).resolve().parent
UTC = timezone.utc

USER_AGENT = (
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
    "(KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36"
)

# Matched against the final URL only (we got redirected into a queue).
DEFAULT_QUEUE_URL_PATTERNS = [
    r"^https?://[^/]*queue-it\.net",
    r"[?&/](?:queue|waitingroom|waiting-room)\b",
    r"/waiting-hallway\b",  # Walmart's waiting room path
]

# Matched against headers + body, case-insensitive. Don't add bare "queue-it"
# here: sites like Costco load the Queue-it script on every page.
DEFAULT_QUEUE_PATTERNS = [
    r"incap_wrt",  # Imperva waiting-room cookie
    r"\bwaiting ?room\b",
    r"\bvirtual (?:queue|line)\b",
    r"you(?:'|’)?re (?:now )?in (?:the )?(?:line|queue)",
    r"you are (?:now )?in (?:the )?(?:line|queue)",
    r"estimated wait(?:ing)? time",
    r"keep this (?:window|page|tab|browser) open",
]

DEFAULT_BLOCKED_PATTERNS = [
    r"Incapsula incident ID",
    r"Request unsuccessful\.",
    r"/blocked\?url=",
    r"/are-you-human",
    r"Pardon Our Interruption",
    r"<title>\s*Access Denied\s*</title>",
    r"Robot or human\?",
]

TZ_ALIASES = {
    "et": "America/New_York", "est": "America/New_York", "edt": "America/New_York",
    "eastern": "America/New_York",
    "ct": "America/Chicago", "cst": "America/Chicago", "cdt": "America/Chicago",
    "central": "America/Chicago",
    "mt": "America/Denver", "mst": "America/Denver", "mdt": "America/Denver",
    "mountain": "America/Denver",
    "pt": "America/Los_Angeles", "pst": "America/Los_Angeles",
    "pdt": "America/Los_Angeles", "pacific": "America/Los_Angeles",
}

MONTHS = {
    "jan": 1, "feb": 2, "mar": 3, "apr": 4, "may": 5, "jun": 6,
    "jul": 7, "aug": 8, "sep": 9, "oct": 10, "nov": 11, "dec": 12,
}

DATE_RE = re.compile(
    r"\b(jan(?:uary)?|feb(?:ruary)?|mar(?:ch)?|apr(?:il)?|may|june?|july?|"
    r"aug(?:ust)?|sep(?:t(?:ember)?)?|oct(?:ober)?|nov(?:ember)?|dec(?:ember)?)"
    r"\.?\s+(\d{1,2})(?:st|nd|rd|th)?\b(?:,?\s+(\d{4}))?",
    re.I,
)
TIME_RE = re.compile(
    r"\b(\d{1,2})(?::(\d{2}))?\s*([ap])\.?\s?m\.?(?![a-z])"
    r"(?:\s*\(?\s*(ET|EST|EDT|CT|CST|CDT|MT|MST|MDT|PT|PST|PDT|"
    r"Eastern|Central|Mountain|Pacific)\b)?",
    re.I,
)
RANGE_JOIN_RE = re.compile(r"^\s*(?:to|until|through|-|–|—)\s*$", re.I)
END_WORDS_RE = re.compile(r"\b(?:clos\w*|ends?|ending|until|deadline)\b[^.]{0,25}$", re.I)


# ---------------------------------------------------------------- utilities


def now_utc() -> datetime:
    return datetime.now(UTC)


def iso(dt: datetime) -> str:
    return dt.astimezone(UTC).isoformat(timespec="seconds")


def parse_iso(s: str) -> datetime:
    return datetime.fromisoformat(s)


def html_to_text(raw: str) -> str:
    raw = re.sub(r"(?is)<(script|style|noscript|svg)\b.*?</\1>", " ", raw)
    raw = re.sub(r"(?s)<[^>]+>", " ", raw)
    return re.sub(r"\s+", " ", html.unescape(raw)).strip()


def trim_text(text: str, start_after: str | None, stop_at: str | None) -> str:
    """Keep only the article body, e.g. drop the comments section."""
    if start_after and (i := text.find(start_after)) >= 0:
        text = text[i + len(start_after):]
    if stop_at and (i := text.find(stop_at)) >= 0:
        text = text[:i]
    return text


def fmt_when(dt: datetime, zones: list[str]) -> str:
    parts = []
    for i, z in enumerate(zones):
        local = dt.astimezone(ZoneInfo(z))
        if i == 0:
            parts.append(local.strftime("%a %b %-d, %-I:%M %p %Z"))
        else:
            parts.append(local.strftime("%-I:%M %p %Z"))
    return " / ".join(parts)


def fmt_delta(delta: timedelta) -> str:
    mins = int(round(delta.total_seconds() / 60))
    if mins <= 0:
        return "<1m"
    days, rem = divmod(mins, 1440)
    hours, mins = divmod(rem, 60)
    out = []
    if days:
        out.append(f"{days}d")
    if hours:
        out.append(f"{hours}h")
    if mins and not days:
        out.append(f"{mins}m")
    return " ".join(out)


# ------------------------------------------------------- start-time extraction


@dataclass
class FoundTime:
    start: datetime
    snippet: str
    items: list[str] = field(default_factory=list)


def extract_items(text: str, item_regex: str, item_keywords: list[str], default_tz: str,
                  now: datetime | None = None) -> list[FoundTime]:
    """Per-product listings, e.g. Walmart's "<product> Drawing starts Oct 14, 2:00pm PDT".

    ``item_regex`` needs named groups ``item`` and ``when``. Items are grouped
    by start time; only items containing one of ``item_keywords`` are kept.
    """
    kw = [k.lower() for k in item_keywords]
    groups: dict[datetime, list[str]] = {}
    for m in re.finditer(item_regex, text, re.I | re.S):
        item = re.sub(r"\s*\d(?:\.\d)? out of 5 stars.*$", "", m.group("item")).strip()
        item = re.sub(r"^Collectible\s+", "", item)
        if kw and not any(k in item.lower() for k in kw):
            continue
        for f in extract_start_times(m.group("when"), [], default_tz, now):
            if item not in groups.setdefault(f.start, []):
                groups[f.start].append(item)
    return [FoundTime(start, "; ".join(items), items) for start, items in sorted(groups.items())]


def summarize_items(items: list[str], limit: int = 3) -> str:
    if not items:
        return ""
    shown = ", ".join(items[:limit])
    return shown + (f" +{len(items) - limit} more" if len(items) > limit else "")


def _infer_year(month: int, day: int, hour: int, minute: int, tz: ZoneInfo, now: datetime) -> datetime | None:
    best = None
    for year in (now.year - 1, now.year, now.year + 1):
        try:
            cand = datetime(year, month, day, hour, minute, tzinfo=tz)
        except ValueError:
            continue
        if best is None or abs(cand - now) < abs(best - now):
            best = cand
    return best


def extract_start_times(
    text: str,
    keywords: list[str],
    default_tz: str,
    now: datetime | None = None,
) -> list[FoundTime]:
    """Find "<Month> <day> ... <h[:mm]> am/pm <TZ>" start times in page text.

    Range ends ("5 PM to 6 PM") and closing times ("closes at 6 PM") are skipped
    so only the moment the window opens is returned.
    """
    now = now or now_utc()
    kw = [k.lower() for k in keywords]
    dates = list(DATE_RE.finditer(text))
    times = list(TIME_RE.finditer(text))
    found: dict[datetime, FoundTime] = {}

    for i, t in enumerate(times):
        if i > 0 and RANGE_JOIN_RE.match(text[times[i - 1].end():t.start()]):
            continue  # second half of a range
        if END_WORDS_RE.search(text[max(0, t.start() - 40):t.start()]):
            continue  # a closing time, not a start
        if text[max(0, t.start() - 3):t.start()].strip().endswith("@"):
            continue  # "Oct 07, 2026 @ 2:00 PM" is a post timestamp

        tz_name = t.group(4)
        if not tz_name:
            # "5:00 PM to 6:00 PM ET" -> borrow the zone from the range end.
            nxt = times[i + 1] if i + 1 < len(times) else None
            if nxt and nxt.group(4) and nxt.start() - t.end() <= 30:
                tz_name = nxt.group(4)
        tz = ZoneInfo(TZ_ALIASES[tz_name.lower()]) if tz_name else ZoneInfo(default_tz)

        date = None
        before = [d for d in dates if d.end() <= t.start() and t.start() - d.end() <= 150]
        if before:
            date = before[-1]
        else:
            after = [d for d in dates if d.start() >= t.end() and d.start() - t.end() <= 60]
            if after:
                date = after[0]
        if not date:
            continue

        lo = min(date.start(), t.start())
        hi = max(date.end(), t.end())
        context = text[max(0, t.start() - 150):t.end() + 150]
        if kw and not any(k in context.lower() for k in kw):
            continue

        hour = int(t.group(1)) % 12 + (12 if t.group(3).lower() == "p" else 0)
        minute = int(t.group(2) or 0)
        if hour > 23 or minute > 59:
            continue
        month = MONTHS[date.group(1)[:3].lower()]
        day = int(date.group(2))
        if date.group(3):
            try:
                start = datetime(int(date.group(3)), month, day, hour, minute, tzinfo=tz)
            except ValueError:
                continue
        else:
            start = _infer_year(month, day, hour, minute, tz, now)
            if start is None:
                continue
        start = start.astimezone(UTC)
        snippet = text[max(0, lo - 80):hi + 80].strip()
        found.setdefault(start, FoundTime(start, snippet))

    return sorted(found.values(), key=lambda f: f.start)


# ------------------------------------------------------------------ fetching


@dataclass
class Page:
    status: int
    url: str
    headers: str
    body: str
    error: str | None = None


def fetch_http(url: str, timeout: int = 25) -> Page:
    req = urllib.request.Request(
        url,
        headers={
            "User-Agent": USER_AGENT,
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
            "Accept-Language": "en-US,en;q=0.9",
            "Cache-Control": "no-cache",
        },
    )
    try:
        with urllib.request.urlopen(req, timeout=timeout) as resp:
            body = resp.read(4_000_000).decode("utf-8", "replace")
            return Page(resp.status, resp.geturl(), str(resp.headers), body)
    except urllib.error.HTTPError as e:
        body = e.read(500_000).decode("utf-8", "replace") if e.fp else ""
        return Page(e.code, e.geturl() or url, str(e.headers), body)
    except Exception as e:  # network errors, timeouts
        return Page(0, url, "", "", error=f"{type(e).__name__}: {e}")


_browser = None


def fetch_browser(url: str, timeout: int = 45) -> Page:
    """Load the page in headless Chromium (pip install playwright)."""
    global _browser
    try:
        from playwright.sync_api import sync_playwright
    except ImportError:
        return Page(0, url, "", "", error="playwright not installed (pip install playwright)")
    if _browser is None:
        pw = sync_playwright().start()
        exe = os.environ.get("CHROMIUM_PATH")
        _browser = pw.chromium.launch(headless=True, executable_path=exe or None)
    ctx = _browser.new_context(user_agent=USER_AGENT, locale="en-US")
    page = ctx.new_page()
    try:
        resp = page.goto(url, timeout=timeout * 1000, wait_until="domcontentloaded")
        page.wait_for_timeout(5000)  # let waiting-room redirects / JS settle
        cookies = "; ".join(c["name"] for c in ctx.cookies())
        return Page(resp.status if resp else 0, page.url, f"cookies: {cookies}", page.content())
    except Exception as e:
        return Page(0, url, "", "", error=f"{type(e).__name__}: {e}")
    finally:
        ctx.close()


def fetch(url: str, use_browser: bool) -> Page:
    return fetch_browser(url) if use_browser else fetch_http(url)


def classify(page: Page, queue_patterns: list[str], blocked_patterns: list[str],
             queue_url_patterns: list[str] = ()) -> str:
    """Return 'queue', 'blocked', 'open' or 'error'."""
    if page.error:
        return "error"
    if any(re.search(p, page.url, re.I) for p in queue_url_patterns):
        return "queue"
    haystack = "\n".join([page.url, page.headers, page.body])
    if any(re.search(p, haystack, re.I) for p in queue_patterns):
        return "queue"
    if page.status in (403, 429) or any(re.search(p, haystack, re.I) for p in blocked_patterns):
        return "blocked"
    if page.status >= 500 or page.status == 0:
        return "error"
    return "open"


def queueit_integrations(customer: str) -> tuple[list[dict] | None, str | None]:
    """Read a retailer's public Queue-it client config.

    It lists ``integrations: []`` when no queue is set up and gains entries
    (event id + trigger URLs) when one is configured, which is often shortly
    before the queue opens. It's a CDN file, so bot walls don't apply.
    """
    url = f"https://assets.queue-it.net/{customer}/integrationconfig/javascript/queueclientConfig.js"
    page = fetch_http(url)
    if page.error or page.status != 200:
        return None, page.error or f"HTTP {page.status}"
    m = re.search(r"queueit_clientside_config\s*=\s*(\{.*\})\s*;", page.body, re.S)
    if not m:
        return None, "config not found"
    try:
        return json.loads(m.group(1)).get("integrations", []), None
    except json.JSONDecodeError as e:
        return None, f"bad JSON: {e}"


def describe_integrations(integrations: list[dict]) -> str:
    out = []
    for it in integrations[:5]:
        name = it.get("name") or it.get("eventId") or "event"
        urls = sorted({
            t.get("ValueToCompare") or t.get("valueToCompare") or ""
            for trig in it.get("triggers", []) or it.get("Triggers", []) or []
            for t in trig.get("triggerParts", []) or trig.get("TriggerParts", []) or []
        } - {""})
        out.append(f"{name} ({it.get('eventId', '?')})" + (f": {', '.join(urls[:3])}" if urls else ""))
    return "; ".join(out)


# ------------------------------------------------------------- notifications


class Notifier:
    name = "base"
    can_schedule = False
    max_delay = timedelta(0)  # how far ahead send(at=...) can schedule

    def send(self, title: str, message: str, *, url: str | None = None,
             priority: int = 3, tags: list[str] | None = None,
             at: datetime | None = None) -> bool:
        raise NotImplementedError


def _post_json(url: str, payload: dict, headers: dict | None = None) -> None:
    data = json.dumps(payload).encode()
    req = urllib.request.Request(
        url, data=data, method="POST",
        headers={"Content-Type": "application/json", "User-Agent": "drop-watcher/1.0", **(headers or {})},
    )
    with urllib.request.urlopen(req, timeout=20) as resp:
        resp.read()


class Ntfy(Notifier):
    """https://ntfy.sh — install the ntfy app and subscribe to your topic.

    ntfy can hold a message and deliver it later (up to 3 days), so reminders
    arrive on time even if this script or GitHub's cron runs late.
    """

    name = "ntfy"
    can_schedule = True
    max_delay = timedelta(days=3)

    def __init__(self, topic: str, server: str, token: str | None):
        self.topic, self.server, self.token = topic, server.rstrip("/"), token

    def send(self, title, message, *, url=None, priority=3, tags=None, at=None):
        payload = {"topic": self.topic, "title": title, "message": message,
                   "priority": priority, "tags": tags or []}
        if url:
            payload["click"] = url
        if at is not None:
            payload["delay"] = str(int(at.timestamp()))
        headers = {"Authorization": f"Bearer {self.token}"} if self.token else {}
        _post_json(self.server, payload, headers)
        return True


class Discord(Notifier):
    name = "discord"

    def __init__(self, webhook: str):
        self.webhook = webhook

    def send(self, title, message, *, url=None, priority=3, tags=None, at=None):
        if at is not None:
            return False  # no scheduled delivery; the run loop sends it when due
        prefix = "🚨 " if priority >= 5 else ("⏰ " if priority == 4 else "")
        content = f"{prefix}**{title}**\n{message}" + (f"\n{url}" if url else "")
        _post_json(self.webhook, {"content": content[:1990]})
        return True


class Console(Notifier):
    name = "console"

    def send(self, title, message, *, url=None, priority=3, tags=None, at=None):
        when = f" [scheduled {iso(at)}]" if at else ""
        print(f"NOTIFY p{priority}{when}: {title} — {message}" + (f" <{url}>" if url else ""))
        return True


def build_notifiers(dry_run: bool) -> list[Notifier]:
    if dry_run:
        return [Console()]
    out: list[Notifier] = []
    if os.environ.get("NTFY_TOPIC"):
        out.append(Ntfy(os.environ["NTFY_TOPIC"],
                        os.environ.get("NTFY_SERVER", "https://ntfy.sh"),
                        os.environ.get("NTFY_TOKEN")))
    if os.environ.get("DISCORD_WEBHOOK_URL"):
        out.append(Discord(os.environ["DISCORD_WEBHOOK_URL"]))
    if not out:
        print("warning: no NTFY_TOPIC or DISCORD_WEBHOOK_URL set; printing alerts only", file=sys.stderr)
        out.append(Console())
    return out


# --------------------------------------------------------------------- state


def load_state(path: Path) -> dict:
    if path.exists():
        return json.loads(path.read_text())
    return {"sites": {}, "events": {}, "history": []}


def save_state(path: Path, state: dict) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    tmp = path.with_suffix(".tmp")
    tmp.write_text(json.dumps(state, indent=2, ensure_ascii=False, sort_keys=True) + "\n")
    tmp.replace(path)


# -------------------------------------------------------------------- watcher


@dataclass
class Watcher:
    config: dict
    state: dict
    notifiers: list[Notifier]
    force_browser: bool = False
    only: set[str] = field(default_factory=set)

    @property
    def zones(self) -> list[str]:
        return self.config.get("display_timezones", ["America/New_York"])

    def record(self, kind: str, message: str) -> None:
        line = f"{iso(now_utc())} {kind}: {message}"
        print(line)
        hist = self.state.setdefault("history", [])
        hist.append({"time": iso(now_utc()), "type": kind, "message": message})
        del hist[:-500]

    def notify(self, title: str, message: str, *, skip: set[str] = frozenset(), **kw) -> set[str]:
        """Send to every notifier not in ``skip``; return the names that accepted."""
        ok = set()
        for n in self.notifiers:
            if n.name in skip:
                continue
            try:
                if n.send(title, message, **kw):
                    ok.add(n.name)
            except Exception as e:
                print(f"notify via {n.name} failed: {e}", file=sys.stderr)
        return ok

    # ---- queues

    def check_queue_site(self, site: dict) -> None:
        name = site["name"]
        st = self.state["sites"].setdefault(name, {"status": "unknown", "blocked_streak": 0})
        prev = st.get("status")
        detail = ""

        if site.get("type") == "queueit":
            integrations, err = queueit_integrations(site["customer"])
            ignore = set(site.get("ignore_event_ids", []))
            if integrations is not None:
                integrations = [i for i in integrations if i.get("eventId") not in ignore]
            status = "error" if integrations is None else ("queue" if integrations else "open")
            print(f"[queue] {name}: {status} via Queue-it config{', ' + err if err else ''}")
            if integrations:
                detail = describe_integrations(integrations)
                sig = hashlib.sha1(json.dumps(integrations, sort_keys=True).encode()).hexdigest()[:12]
                if prev == "queue" and st.get("sig") != sig:
                    self.record("queue_change", f"{name} queue config changed: {detail}")
                    self.notify(f"{name} queue changed", f"New/updated queue: {detail}",
                                url=site.get("open_url"), priority=4, tags=["rotating_light"])
                st["sig"] = sig
            url = site.get("open_url", "")
        else:
            use_browser = self.force_browser or site.get("fetch") == "browser"
            page = fetch(site["url"], use_browser)
            status = classify(
                page,
                DEFAULT_QUEUE_PATTERNS + site.get("queue_patterns", []),
                DEFAULT_BLOCKED_PATTERNS + site.get("blocked_patterns", []),
                DEFAULT_QUEUE_URL_PATTERNS + site.get("queue_url_patterns", []),
            )
            print(f"[queue] {name}: {status} (HTTP {page.status}{', ' + page.error if page.error else ''})")
            url = site.get("open_url", site["url"])
            if status == "queue":
                detail = f"Redirected to {page.url}" if page.url != site["url"] else ""

        if status in ("blocked", "error"):
            limit = self.config.get("blind_alert_after", 6)
            st["blocked_streak"] = min(st.get("blocked_streak", 0) + 1, limit + 1)
            if st["blocked_streak"] == limit:
                self.record("blind", f"{name} has been {status} for {limit} checks in a row")
                self.notify(
                    f"Can't see {name}",
                    f"{name} has been {status} for {limit} checks in a row, so a queue there "
                    "would be missed. Run the watcher from home (residential IP) or with --browser.",
                    priority=2, tags=["warning"],
                )
            return  # don't let a block page flip queue state either way

        if st.get("blocked_streak", 0) >= self.config.get("blind_alert_after", 6):
            self.record("visible", f"{name} is reachable again")
        st["blocked_streak"] = 0

        if status == "queue" and prev != "queue":
            st["status"], st["since"] = "queue", iso(now_utc())
            self.record("queue_start", f"{name} queue detected. {detail}".strip())
            self.notify(
                f"{name} queue is LIVE",
                f"Queue detected {fmt_when(now_utc(), self.zones)}. Join now and keep the tab open."
                + (f"\n{detail}" if detail else ""),
                url=url, priority=5, tags=["rotating_light"],
            )
        elif status == "open" and prev == "queue":
            started = parse_iso(st["since"]) if st.get("since") else None
            dur = f" after {fmt_delta(now_utc() - started)}" if started else ""
            st["status"], st["since"] = "open", iso(now_utc())
            self.record("queue_end", f"{name} queue ended{dur}")
            self.notify(f"{name} queue ended", f"The waiting room is gone{dur}.",
                        url=url, priority=3, tags=["checkered_flag"])
        elif status != prev:
            st["status"], st["since"] = status, iso(now_utc())

    # ---- drawings / raffles

    def check_announcements(self, src: dict) -> None:
        use_browser = self.force_browser or src.get("fetch") == "browser"
        page = fetch(src["url"], use_browser)
        status = classify(page, [], DEFAULT_BLOCKED_PATTERNS + src.get("blocked_patterns", []))
        if status != "open":
            print(f"[drawing] {src['name']}: {status} (HTTP {page.status})")
            return
        text = trim_text(html_to_text(page.body), src.get("start_after"), src.get("stop_at"))
        now = now_utc()
        window = timedelta(minutes=self.config.get("entry_window_minutes", 60))
        tz = src.get("default_timezone", "America/New_York")
        if src.get("item_regex"):
            found = extract_items(text, src["item_regex"], src.get("item_keywords", []), tz, now)
        else:
            found = extract_start_times(text, src.get("keywords", []), tz, now)
        horizon = now + timedelta(days=self.config.get("max_days_ahead", 45))
        upcoming = [f for f in found if now - window < f.start < horizon]
        print(f"[drawing] {src['name']}: {len(found)} times on page, {len(upcoming)} upcoming")
        for f in upcoming:
            self.add_event(src, f)

    def add_event(self, src: dict, f: FoundTime) -> None:
        retailer = src.get("retailer", src["name"])
        eid = hashlib.sha1(f"{retailer}|{iso(f.start)}".encode()).hexdigest()[:12]
        if eid in self.state["events"]:
            ev = self.state["events"][eid]
            new = [i for i in f.items if i not in ev.get("items", [])]
            if new:
                ev["items"] = ev.get("items", []) + new
                self.record("event_items", f"{retailer} {ev['label']}: added {summarize_items(new, 10)}")
            return
        now = now_utc()
        label = src.get("label", "drawing")
        window = timedelta(minutes=self.config.get("entry_window_minutes", 60))
        offsets = self.reminder_offsets()
        ev = {
            "retailer": retailer, "label": label, "source": src["name"],
            "url": src.get("open_url", src["url"]), "start": iso(f.start),
            "found_at": iso(now), "snippet": f.snippet[:400], "items": f.items,
            "sent": [], "scheduled": {},
        }
        # Reminders whose time already passed are covered by the announcement below.
        ev["sent"] = [o for o in offsets if f.start - timedelta(minutes=o) <= now]
        self.state["events"][eid] = ev
        when = fmt_when(f.start, self.zones)
        self.record("event", f"{retailer} {label} at {when} (from {src['name']})")

        if f.start <= now:
            msg = f"Opened {when}. Window closes around {fmt_when(f.start + window, self.zones[:1])}."
            self.notify(f"{retailer} {label} is OPEN", msg, url=ev["url"], priority=5, tags=["tickets"])
            return
        detail = ("Items: " + summarize_items(f.items, 8)) if f.items else f"“{f.snippet[:200]}”"
        self.notify(
            f"{retailer} {label} announced",
            f"Opens {when} (in {fmt_delta(f.start - now)}). Entry window ~{int(window.total_seconds() // 60)} min."
            + (f" Reminder {self.reminder_offsets()[0]} min before." if [o for o in self.reminder_offsets()
                                                                       if o not in ev["sent"] and o] else "")
            + "\n" + detail,
            url=ev["url"], priority=4, tags=["calendar"],
        )
        # Hand future reminders to notifiers that can deliver them on time.
        for n in self.notifiers:
            if not n.can_schedule:
                continue
            keys = []
            for o in offsets:
                at = f.start - timedelta(minutes=o)
                if o in ev["sent"] or at - now > n.max_delay:
                    continue
                title, msg, prio = self.reminder_text(ev, o)
                try:
                    if n.send(title, msg, url=ev["url"], priority=prio, tags=["alarm_clock"], at=at):
                        keys.append(o)
                except Exception as e:
                    print(f"scheduling via {n.name} failed: {e}", file=sys.stderr)
            ev["scheduled"][n.name] = keys

    def reminder_offsets(self) -> list[int]:
        """Minutes before the start to remind at, largest first (0 = at opening)."""
        offsets = set(self.config.get("reminder_minutes", [5]))
        if self.config.get("remind_at_open", False):
            offsets.add(0)
        return sorted(offsets, reverse=True)

    def reminder_text(self, ev: dict, offset: int) -> tuple[str, str, int]:
        start = parse_iso(ev["start"])
        window = timedelta(minutes=self.config.get("entry_window_minutes", 60))
        name = f"{ev['retailer']} {ev['label']}"
        items = summarize_items(ev.get("items", []))
        items = f"\n{items}" if items else ""
        if offset == 0:
            return (f"{name} is OPEN", f"Enter now — closes around "
                    f"{fmt_when(start + window, self.zones[:1])}.{items}", 5)
        return (f"{name} in {fmt_delta(timedelta(minutes=offset))}",
                f"Opens {fmt_when(start, self.zones)}. Have your login, address and card ready.{items}", 4)

    def send_due_reminders(self) -> None:
        now = now_utc()
        window = timedelta(minutes=self.config.get("entry_window_minutes", 60))
        for ev in self.state["events"].values():
            start = parse_iso(ev["start"])
            if now > start + window:
                continue
            offsets = self.reminder_offsets()
            due = [o for o in offsets if o not in ev["sent"] and now >= start - timedelta(minutes=o)]
            if not due:
                continue
            o = min(due)  # if we're late, only send the most relevant one
            skip = {name for name, keys in ev.get("scheduled", {}).items() if o in keys}
            title, msg, prio = self.reminder_text(ev, o)
            self.notify(title, msg, url=ev["url"], priority=prio, tags=["alarm_clock"], skip=skip)
            ev["sent"] = sorted(set(ev["sent"]) | set(due), reverse=True)
            self.record("reminder", f"{title}")

    def prune(self) -> None:
        cutoff = now_utc() - timedelta(days=self.config.get("keep_days", 120))
        self.state["events"] = {
            k: v for k, v in self.state["events"].items() if parse_iso(v["start"]) > cutoff
        }

    def wanted(self, entry: dict) -> bool:
        if not entry.get("enabled", True):
            return False
        if self.only:
            return entry["name"] in self.only
        if os.environ.get("GITHUB_ACTIONS") == "true" and entry.get("skip_in_ci"):
            return False
        return True

    def run_once(self, drawings: bool = True) -> None:
        for site in self.config.get("queue_sites", []):
            if self.wanted(site):
                self.check_queue_site(site)
        if drawings:
            for src in self.config.get("announcement_sources", []):
                if self.wanted(src):
                    self.check_announcements(src)
        self.send_due_reminders()
        self.prune()


# ----------------------------------------------------------------------- main


def main(argv: list[str] | None = None) -> int:
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--config", type=Path, default=HERE / "config.toml")
    ap.add_argument("--state", type=Path, default=HERE / "state.json")
    ap.add_argument("--loop", action="store_true",
                    help="keep running: queues every queue_interval_seconds, drawings every interval_seconds")
    ap.add_argument("--browser", action="store_true", help="fetch every page with headless Chromium")
    ap.add_argument("--dry-run", action="store_true", help="print alerts instead of sending them")
    ap.add_argument("--test-notify", action="store_true", help="send one test alert and exit")
    ap.add_argument("--only", action="append", default=[], metavar="NAME",
                    help="check only this site/source name (repeatable)")
    args = ap.parse_args(argv)

    config = tomllib.loads(args.config.read_text())
    notifiers = build_notifiers(args.dry_run)

    if args.test_notify:
        ok = Watcher(config, {}, notifiers).notify(
            "Drop watcher test", "If you can read this, alerts work.", priority=4, tags=["white_check_mark"])
        print(f"sent via: {', '.join(sorted(ok)) or 'nothing'}")
        return 0 if ok else 1

    # Queues need an alert within a minute; drawings are announced hours ahead,
    # so their pages are read less often.
    drawing_every = config.get("interval_seconds", 300)
    queue_every = config.get("queue_interval_seconds", 60) if args.loop else drawing_every
    last_drawings = 0.0
    while True:
        state = load_state(args.state)
        watcher = Watcher(config, state, notifiers, force_browser=args.browser, only=set(args.only))
        drawings = time.monotonic() - last_drawings >= drawing_every * 0.8
        try:
            watcher.run_once(drawings=drawings)
        finally:
            save_state(args.state, state)
        if drawings:
            last_drawings = time.monotonic()
        if not args.loop:
            return 0
        time.sleep(queue_every * random.uniform(0.8, 1.2))


if __name__ == "__main__":
    sys.exit(main())
