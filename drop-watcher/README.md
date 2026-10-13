# Drop watcher

Pushes a phone alert when:

- **a queue goes up** at Pokémon Center, Costco or Sam's Club, and when it ends;
- **a drawing (raffle) is announced** for Walmart or Target. It records the start
  time and reminds you **60 and 15 minutes before**, then again **when entry opens**.
  You get about an hour to enter, so you don't need to be first.

Everything is in `config.toml`: sites, keywords, reminder times, time zones.
Plain Python 3.11+, no packages needed.

## 1. Set up alerts (2 minutes)

**ntfy (recommended, phone push):** install the ntfy app (iOS/Android), tap
*Subscribe*, and pick a long, random topic name such as `puneeth-drops-k29fx7q`.
Anyone who knows the name can read it, so don't use a guessable one. ntfy holds
reminders and delivers them on time, even if the watcher runs late.

**Discord (optional):** Channel → Edit → Integrations → Webhooks → New Webhook → Copy URL.

## 2. Run it

### On GitHub (no computer needed)

In this repo, open Settings → Secrets and variables → Actions and add `NTFY_TOPIC` and/or
`DISCORD_WEBHOOK_URL`. The **Drop watcher** workflow then runs every 5 minutes.
To run it right away, use Actions → Drop watcher → *Run workflow*.

Detected drawings and queue history are saved to `state.json` on the
`drop-watcher-data` branch, so the portfolio's `main` branch is never touched.

### On your PC / Raspberry Pi (needed for Pokémon Center and Sam's Club)

```bash
export NTFY_TOPIC=puneeth-drops-k29fx7q
python3 drop-watcher/drop_watcher.py --test-notify   # check alerts arrive
python3 drop-watcher/drop_watcher.py --loop           # check every ~5 min, forever
```

Pokémon Center (Imperva) and Sam's Club ("Robot or human?") block cloud
servers, including GitHub Actions. They usually allow a home internet
connection. The GitHub workflow skips these two (`skip_in_ci = true`), so a
good split is:

- **GitHub:** Walmart and Target drawings, plus Costco.
- **Home:** `python3 drop-watcher/drop_watcher.py --loop --only "Pokémon Center" --only "Sam's Club"`

If a site is still blocked, try `--browser` (`pip install playwright && playwright install chromium`).
If a site stays unreachable for 6 checks in a row, you get one "Can't see …" warning,
so a blocked site doesn't fail silently.

## How each site is detected

| Site | How | Notes |
|---|---|---|
| Pokémon Center | Homepage redirects to a waiting room, or the page shows waiting-room or "high traffic" text | Needs a home IP |
| Costco | Costco's public Queue-it config (`assets.queue-it.net/costco/...`) lists no queues normally and gains one when a queue is set up | Often fires before the queue opens; works from anywhere |
| Sam's Club | Redirect to queue-it.net or waiting-room text | Needs a home IP |
| Walmart drawing | Hip2Save's running "Walmart Drawing" post ("Enter Today's Walmart Drawing at 5PM ET…") | Walmart's own drawing page blocks cloud IPs. Add its URL in `config.toml` when running at home. |
| Target drawing | TrackaLacker's Target drawing news page | Target hasn't officially launched drawings yet. Add better sources to `config.toml` as they appear. |

To add a source, add an `[[announcement_sources]]` block with a URL and
keywords. Any "<Month> <day> … <time> <ET/PT>" near those keywords counts as a
start time. End times ("5 PM to 6 PM", "closes at 6 PM") are ignored.

## Options

```
--dry-run        print alerts instead of sending them
--only NAME      check just one site/source (repeatable)
--browser        load pages in headless Chromium
--state PATH     where to keep state (default drop-watcher/state.json)
```

Tests: `cd drop-watcher && python3 -m unittest`

## Limits

- GitHub's 5-minute schedule often runs a few minutes late, and GitHub pauses
  scheduled workflows after 60 days without repo activity. Re-enable it on the
  Actions tab if that happens. ntfy reminders aren't affected once scheduled.
- Start times come from page text. If a source changes its wording, an
  announcement can be missed. Keep at least two sources per retailer when you can.
- This only reads public pages every few minutes. It never enters drawings or buys anything.
