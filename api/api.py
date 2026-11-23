#!/usr/bin/env python3
"""chipnuke api: hit counter and guestbook. Python stdlib only.

nginx proxies /api/* here. The database lives in /data (a volume).

Admin commands (run inside the api container):
  python3 /api/api.py list            show pending entries
  python3 /api/api.py approve <id>    publish an entry
  python3 /api/api.py reject <id>     delete an entry
"""
import hashlib
import json
import os
import sqlite3
import sys
import threading
import time
import urllib.request
from datetime import datetime, timezone
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer

DB = os.environ.get("DB_PATH", "/data/chipnuke.db")
PORT = int(os.environ.get("PORT", "8081"))
WEBHOOK = os.environ.get("GUESTBOOK_WEBHOOK", "").strip()
SALT = os.environ.get("IP_SALT", "") or "chipnuke"
CONTAINER = os.environ.get("API_CONTAINER", "chipnuke-api-1")  # shown in Discord commands
MAX_BODY = 4096
RATE_LIMIT = 3          # guestbook posts per address
RATE_WINDOW = 3600      # seconds

lock = threading.Lock()
counted = {"day": "", "who": set()}  # one hit per address per day, memory only


def db():
    con = sqlite3.connect(DB, timeout=5)
    con.row_factory = sqlite3.Row
    return con


def init():
    with db() as con:
        con.executescript("""
        CREATE TABLE IF NOT EXISTS hits (id INTEGER PRIMARY KEY CHECK (id = 1), count INTEGER NOT NULL);
        INSERT OR IGNORE INTO hits (id, count) VALUES (1, 0);
        CREATE TABLE IF NOT EXISTS guestbook (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL, message TEXT NOT NULL, website TEXT NOT NULL DEFAULT '',
            created TEXT NOT NULL, approved INTEGER NOT NULL DEFAULT 0, who TEXT NOT NULL
        );
        CREATE INDEX IF NOT EXISTS gb_who ON guestbook (who, created);
        """)


def now():
    return datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")


def clean(value, limit):
    text = str(value or "").replace("\r\n", "\n").strip()
    text = "".join(ch for ch in text if ch == "\n" or ch.isprintable())
    return text[:limit]


def notify(entry_id, name, message, website):
    if not WEBHOOK:
        return
    body = json.dumps({
        "username": "chipnuke guestbook",
        "content": f"New guestbook entry #{entry_id} from **{name}**" + (f" ({website})" if website else "") + "\n"
                   f"Approve: `docker exec {CONTAINER} python3 /api/api.py approve {entry_id}`\n"
                   f"Reject: `docker exec {CONTAINER} python3 /api/api.py reject {entry_id}`\n"
                   f">>> {message}",
        "allowed_mentions": {"parse": []},
    }).encode()
    req = urllib.request.Request(WEBHOOK, data=body, headers={"Content-Type": "application/json", "User-Agent": "chipnuke-api"})
    try:
        urllib.request.urlopen(req, timeout=5).read()
    except Exception as exc:  # the entry is saved even when Discord is down
        print(f"webhook failed: {exc}", flush=True)


class Handler(BaseHTTPRequestHandler):
    server_version = "chipnuke"
    sys_version = ""

    def log_message(self, fmt, *args):
        pass  # no access log: nginx has one, and we keep no addresses

    def send(self, code, payload):
        data = json.dumps(payload).encode()
        self.send_response(code)
        self.send_header("Content-Type", "application/json")
        self.send_header("Cache-Control", "no-store")
        self.send_header("Content-Length", str(len(data)))
        self.end_headers()
        self.wfile.write(data)

    def who(self):
        ip = self.headers.get("X-Real-IP") or self.client_address[0]
        day = time.strftime("%Y-%m-%d")
        return hashlib.sha256(f"{SALT}|{day}|{ip}".encode()).hexdigest()[:24]

    def body(self):
        size = int(self.headers.get("Content-Length") or 0)
        if size <= 0 or size > MAX_BODY:
            return None
        try:
            return json.loads(self.rfile.read(size))
        except ValueError:
            return None

    def do_GET(self):
        if self.path == "/api/healthz":
            return self.send(200, {"ok": True})
        if self.path == "/api/hits":
            with db() as con:
                return self.send(200, {"count": con.execute("SELECT count FROM hits WHERE id = 1").fetchone()[0]})
        if self.path == "/api/guestbook":
            with db() as con:
                rows = con.execute("SELECT id, name, message, website, created FROM guestbook WHERE approved = 1 ORDER BY id DESC LIMIT 200").fetchall()
            return self.send(200, {"entries": [dict(r) for r in rows]})
        self.send(404, {"error": "Not found."})

    def do_POST(self):
        if self.path == "/api/hits":
            who, day = self.who(), time.strftime("%Y-%m-%d")
            with lock, db() as con:
                if counted["day"] != day:
                    counted["day"], counted["who"] = day, set()
                if who not in counted["who"] and len(counted["who"]) < 100000:
                    counted["who"].add(who)
                    con.execute("UPDATE hits SET count = count + 1 WHERE id = 1")
                return self.send(200, {"count": con.execute("SELECT count FROM hits WHERE id = 1").fetchone()[0]})
        if self.path == "/api/guestbook":
            data = self.body()
            if not isinstance(data, dict):
                return self.send(400, {"error": "Send the form as JSON, under 4 KB."})
            if clean(data.get("fax"), 50):
                return self.send(202, {"ok": True})  # honeypot: pretend it worked
            name = clean(data.get("name"), 40)
            message = clean(data.get("message"), 500)
            website = clean(data.get("website"), 200)
            if not name or not message:
                return self.send(400, {"error": "Name and message are required."})
            if website and not website.startswith(("https://", "http://")):
                return self.send(400, {"error": "Your site must start with https:// or http://."})
            who = self.who()
            since = datetime.fromtimestamp(time.time() - RATE_WINDOW, timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")
            with lock, db() as con:
                recent = con.execute("SELECT COUNT(*) FROM guestbook WHERE who = ? AND created > ?", (who, since)).fetchone()[0]
                if recent >= RATE_LIMIT:
                    return self.send(429, {"error": "That's a lot of signing. Try again in an hour."})
                cur = con.execute("INSERT INTO guestbook (name, message, website, created, who) VALUES (?, ?, ?, ?, ?)",
                                  (name, message, website, now(), who))
                entry_id = cur.lastrowid
            threading.Thread(target=notify, args=(entry_id, name, message, website), daemon=True).start()
            return self.send(202, {"ok": True})
        self.send(404, {"error": "Not found."})


def admin(args):
    init()
    with db() as con:
        if args[0] == "list":
            for r in con.execute("SELECT id, name, message, website, created FROM guestbook WHERE approved = 0 ORDER BY id"):
                print(f"#{r['id']} {r['created']} {r['name']} {r['website']}\n    {r['message']}")
        elif args[0] in ("approve", "reject") and len(args) == 2:
            sql = "UPDATE guestbook SET approved = 1 WHERE id = ?" if args[0] == "approve" else "DELETE FROM guestbook WHERE id = ?"
            n = con.execute(sql, (int(args[1]),)).rowcount
            print(f"{args[0]}d #{args[1]}" if n else f"no entry #{args[1]}")
        else:
            print(__doc__)
            sys.exit(2)


if __name__ == "__main__":
    if len(sys.argv) > 1:
        admin(sys.argv[1:])
    else:
        init()
        print(f"chipnuke api on :{PORT}", flush=True)
        ThreadingHTTPServer(("0.0.0.0", PORT), Handler).serve_forever()
