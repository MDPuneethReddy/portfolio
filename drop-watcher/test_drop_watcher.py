import unittest
from datetime import datetime, timedelta, timezone
from unittest import mock

import drop_watcher as d

UTC = timezone.utc
NOW = datetime(2026, 10, 13, 16, 0, tzinfo=UTC)  # 12:00 PM EDT


class ExtractTimes(unittest.TestCase):
    def times(self, text, keywords=("drawing",)):
        return [f.start for f in d.extract_start_times(text, list(keywords), "America/New_York", NOW)]

    def test_title_with_byline_date(self):
        text = ("Enter Today's Walmart Drawing at 5PM ET for Pokémon Cards By Nicole | "
                "Staff Writer Oct 14, 2026 @ 2:00 PM MDT")
        self.assertEqual(self.times(text), [datetime(2026, 10, 14, 21, 0, tzinfo=UTC)])

    def test_range_keeps_only_start_and_borrows_zone(self):
        text = "The drawing on October 20 is open from 5:00 PM to 6:00 PM ET / 2:00 PM to 3:00 PM PT."
        self.assertEqual(self.times(text), [datetime(2026, 10, 20, 21, 0, tzinfo=UTC)])

    def test_closing_time_is_not_a_start(self):
        text = "Pokémon drawing October 20: entries close at 6 PM ET."
        self.assertEqual(self.times(text), [])

    def test_date_after_time_and_pt(self):
        text = "Walmart added its Pokémon drawing at 6 p.m. PT on October 31."
        self.assertEqual(self.times(text), [datetime(2026, 11, 1, 1, 0, tzinfo=UTC)])

    def test_year_inferred_across_new_year(self):
        now = datetime(2026, 12, 30, tzinfo=UTC)
        got = d.extract_start_times("Target drawing Jan 3 at 10 AM ET", ["drawing"], "America/New_York", now)
        self.assertEqual(got[0].start, datetime(2027, 1, 3, 15, 0, tzinfo=UTC))

    def test_keyword_required(self):
        self.assertEqual(self.times("Store hours October 20 at 9 AM ET."), [])

    def test_am_inside_word_ignored(self):
        self.assertEqual(self.times("Drawing October 20, 10 amazing prizes"), [])


class Classify(unittest.TestCase):
    def page(self, url="https://x.com/", body="", status=200, headers=""):
        return d.Page(status, url, headers, body)

    def c(self, page):
        return d.classify(page, d.DEFAULT_QUEUE_PATTERNS, d.DEFAULT_BLOCKED_PATTERNS,
                          d.DEFAULT_QUEUE_URL_PATTERNS)

    def test_queueit_redirect(self):
        self.assertEqual(self.c(self.page(url="https://costco.queue-it.net/?c=costco&e=x")), "queue")

    def test_queueit_script_on_normal_page_is_not_a_queue(self):
        body = '<script src="https://static.queue-it.net/script/queueconfigloader.min.js" data-queueit-c="costco">'
        self.assertEqual(self.c(self.page(body=body)), "open")

    def test_waiting_room_text(self):
        self.assertEqual(self.c(self.page(body="You are now in line. Keep this window open.")), "queue")

    def test_incapsula_block(self):
        self.assertEqual(self.c(self.page(body="Request unsuccessful. Incapsula incident ID: 1")), "blocked")

    def test_px_block(self):
        self.assertEqual(self.c(self.page(url="https://www.walmart.com/blocked?url=L2")), "blocked")


class Recorder(d.Notifier):
    def __init__(self, name, can_schedule):
        self.name, self.can_schedule, self.sent = name, can_schedule, []
        self.max_delay = timedelta(days=3) if can_schedule else timedelta(0)

    def send(self, title, message, *, url=None, priority=3, tags=None, at=None):
        if at is not None and not self.can_schedule:
            return False
        self.sent.append((title, at))
        return True


class Reminders(unittest.TestCase):
    config = {"reminder_minutes": [60, 15], "entry_window_minutes": 60,
              "display_timezones": ["America/New_York"]}
    src = {"name": "src", "retailer": "Walmart", "url": "https://example.com"}

    def setUp(self):
        self.ntfy = Recorder("ntfy", True)
        self.discord = Recorder("discord", False)
        self.state = {"sites": {}, "events": {}, "history": []}
        self.w = d.Watcher(self.config, self.state, [self.ntfy, self.discord])

    def at(self, when):
        return mock.patch.object(d, "now_utc", return_value=when)

    def test_announce_schedules_ntfy_and_loop_sends_discord(self):
        start = NOW + timedelta(hours=3)
        with self.at(NOW):
            self.w.add_event(self.src, d.FoundTime(start, "Walmart drawing"))
        self.assertEqual([t for t, _ in self.discord.sent], ["Walmart drawing announced"])
        scheduled = [at for _, at in self.ntfy.sent if at]
        self.assertEqual(scheduled, [start - timedelta(minutes=60), start - timedelta(minutes=15), start])

        with self.at(start - timedelta(minutes=59)):
            self.w.send_due_reminders()
        self.assertEqual(self.discord.sent[-1][0], "Walmart drawing in 1h")
        self.assertEqual(len([s for s in self.ntfy.sent if s[1] is None]), 1)  # only the announcement

        with self.at(start - timedelta(minutes=59)):
            self.w.send_due_reminders()  # no duplicates
        self.assertEqual(len(self.discord.sent), 2)

    def test_late_run_sends_only_latest_reminder(self):
        start = NOW + timedelta(hours=3)
        with self.at(NOW):
            self.w.add_event(self.src, d.FoundTime(start, "x"))
        with self.at(start + timedelta(minutes=5)):
            self.w.send_due_reminders()
        self.assertEqual([t for t, _ in self.discord.sent][1:], ["Walmart drawing is OPEN"])

    def test_same_event_found_twice_is_recorded_once(self):
        start = NOW + timedelta(hours=3)
        with self.at(NOW):
            self.w.add_event(self.src, d.FoundTime(start, "x"))
            self.w.add_event(self.src, d.FoundTime(start, "x"))
        self.assertEqual(len(self.state["events"]), 1)

    def test_queue_transitions(self):
        site = {"name": "Costco", "type": "queueit", "customer": "costco", "open_url": "u"}
        with mock.patch.object(d, "queueit_integrations", return_value=([{"eventId": "drop1", "name": "Pokemon"}], None)):
            self.w.check_queue_site(site)
            self.w.check_queue_site(site)
        with mock.patch.object(d, "queueit_integrations", return_value=([], None)):
            self.w.check_queue_site(site)
        self.assertEqual([t for t, _ in self.discord.sent], ["Costco queue is LIVE", "Costco queue ended"])


if __name__ == "__main__":
    unittest.main()
