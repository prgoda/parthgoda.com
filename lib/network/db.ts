import fs from "fs";
import path from "path";
import Database from "better-sqlite3";

/**
 * Local-only SQLite file. Nothing about this app talks to a hosted database:
 * the whole network lives in data/network.db, which is gitignored.
 *
 * Resolved lazily so a script can load .env.local before the first query.
 */
export function dbPath(): string {
  return (
    process.env.NETWORK_DB_PATH ?? path.join(process.cwd(), "data", "network.db")
  );
}

const SCHEMA = `
CREATE TABLE IF NOT EXISTS people (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  name          TEXT    NOT NULL,
  gender        TEXT    NOT NULL DEFAULT 'unspecified',
  email         TEXT,
  phone         TEXT,
  linkedin      TEXT,
  company       TEXT,
  role          TEXT,
  location      TEXT,
  where_met     TEXT,
  met_year      INTEGER,
  closeness     INTEGER NOT NULL DEFAULT 3,
  cadence_days  INTEGER NOT NULL DEFAULT 90,
  tags          TEXT,
  notes         TEXT,
  archived      INTEGER NOT NULL DEFAULT 0,
  snooze_until  TEXT,
  created_at    TEXT    NOT NULL,
  updated_at    TEXT    NOT NULL
);

CREATE TABLE IF NOT EXISTS interactions (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  person_id   INTEGER NOT NULL REFERENCES people(id) ON DELETE CASCADE,
  occurred_on TEXT    NOT NULL,
  direction   TEXT    NOT NULL DEFAULT 'outbound',
  channel     TEXT    NOT NULL DEFAULT 'other',
  responded   INTEGER NOT NULL DEFAULT 0,
  note        TEXT,
  created_at  TEXT    NOT NULL
);

CREATE TABLE IF NOT EXISTS reminder_log (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  person_id   INTEGER NOT NULL REFERENCES people(id) ON DELETE CASCADE,
  sent_on     TEXT    NOT NULL,
  created_at  TEXT    NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_interactions_person ON interactions(person_id, occurred_on DESC);
CREATE INDEX IF NOT EXISTS idx_people_archived     ON people(archived);
CREATE INDEX IF NOT EXISTS idx_reminder_person     ON reminder_log(person_id, sent_on DESC);

/* people plus their derived contact history, so every read path agrees.
   Rebuilt on every open: it holds no data, so this is free and keeps old
   databases in step when the shape changes. */
DROP VIEW IF EXISTS people_status;
CREATE VIEW people_status AS
SELECT
  p.*,
  (SELECT MAX(occurred_on) FROM interactions i WHERE i.person_id = p.id) AS last_contact,
  (SELECT MAX(occurred_on) FROM interactions i WHERE i.person_id = p.id AND i.direction = 'outbound') AS last_outbound,
  (SELECT MAX(occurred_on) FROM interactions i WHERE i.person_id = p.id AND i.direction = 'inbound')  AS last_inbound,
  (SELECT i.responded FROM interactions i WHERE i.person_id = p.id AND i.direction = 'outbound'
     ORDER BY i.occurred_on DESC, i.id DESC LIMIT 1) AS last_outbound_responded,
  (SELECT COUNT(*)         FROM interactions i WHERE i.person_id = p.id) AS interaction_count
FROM people p;
`;

type DB = InstanceType<typeof Database>;

// Next's dev server re-evaluates modules on every edit; without this the
// process ends up holding dozens of open handles to the same file.
const globalForDb = globalThis as unknown as { __networkDb?: DB };

function open(): DB {
  const file = dbPath();
  fs.mkdirSync(path.dirname(file), { recursive: true });
  const db = new Database(file);
  db.pragma("journal_mode = WAL");
  db.pragma("foreign_keys = ON");
  db.exec(SCHEMA);
  return db;
}

export function getDb(): DB {
  if (!globalForDb.__networkDb) globalForDb.__networkDb = open();
  return globalForDb.__networkDb;
}
