import type { Client, InArgs } from "@libsql/client";

/**
 * One driver, two homes. Locally this is a plain SQLite file under data/;
 * in production it points at Turso, which speaks the same dialect over HTTP.
 * Set TURSO_DATABASE_URL (+ TURSO_AUTH_TOKEN) and it switches by itself.
 */
function connectionUrl(): string {
  const turso = process.env.TURSO_DATABASE_URL?.trim();
  if (turso) return turso;
  const file = process.env.NETWORK_DB_PATH?.trim() ?? "data/network.db";
  return file.startsWith("file:") ? file : `file:${file}`;
}

export function isRemote(): boolean {
  return Boolean(process.env.TURSO_DATABASE_URL?.trim());
}

const SCHEMA: string[] = [
  `CREATE TABLE IF NOT EXISTS people (
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
  )`,
  `CREATE TABLE IF NOT EXISTS interactions (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    person_id   INTEGER NOT NULL REFERENCES people(id) ON DELETE CASCADE,
    occurred_on TEXT    NOT NULL,
    direction   TEXT    NOT NULL DEFAULT 'outbound',
    channel     TEXT    NOT NULL DEFAULT 'other',
    responded   INTEGER NOT NULL DEFAULT 0,
    note        TEXT,
    created_at  TEXT    NOT NULL
  )`,
  `CREATE TABLE IF NOT EXISTS reminder_log (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    person_id   INTEGER NOT NULL REFERENCES people(id) ON DELETE CASCADE,
    sent_on     TEXT    NOT NULL,
    created_at  TEXT    NOT NULL
  )`,
  `CREATE INDEX IF NOT EXISTS idx_interactions_person ON interactions(person_id, occurred_on DESC)`,
  `CREATE INDEX IF NOT EXISTS idx_people_archived ON people(archived)`,
  `CREATE INDEX IF NOT EXISTS idx_reminder_person ON reminder_log(person_id, sent_on DESC)`,
  // The view holds no data, so it is rebuilt rather than migrated. Both
  // statements go in one batch, which libSQL runs as a transaction, so a
  // concurrent read can never land on the gap where the view does not exist.
  `DROP VIEW IF EXISTS people_status`,
  `CREATE VIEW people_status AS
   SELECT
     p.*,
     (SELECT MAX(occurred_on) FROM interactions i WHERE i.person_id = p.id) AS last_contact,
     (SELECT MAX(occurred_on) FROM interactions i WHERE i.person_id = p.id AND i.direction = 'outbound') AS last_outbound,
     (SELECT MAX(occurred_on) FROM interactions i WHERE i.person_id = p.id AND i.direction = 'inbound')  AS last_inbound,
     (SELECT i.responded FROM interactions i WHERE i.person_id = p.id AND i.direction = 'outbound'
        ORDER BY i.occurred_on DESC, i.id DESC LIMIT 1) AS last_outbound_responded,
     (SELECT COUNT(*) FROM interactions i WHERE i.person_id = p.id) AS interaction_count
   FROM people p`,
];

// Next re-evaluates modules on every edit in dev, and a serverless instance
// handles many requests; both want one client and one schema run per process.
const globalForDb = globalThis as unknown as {
  __networkClient?: Client;
  __networkReady?: Promise<Client>;
};

/**
 * The local file needs libSQL's native binding; a remote Turso database only
 * needs HTTP. Picking the right entry point per URL keeps native code out of
 * the serverless bundle entirely.
 */
async function createDbClient(url: string): Promise<Client> {
  if (url.startsWith("file:")) {
    const { createClient } = await import("@libsql/client");
    return createClient({ url });
  }
  const { createClient } = await import("@libsql/client/web");
  return createClient({ url, authToken: process.env.TURSO_AUTH_TOKEN });
}

async function connect(): Promise<Client> {
  const client =
    globalForDb.__networkClient ?? (await createDbClient(connectionUrl()));
  globalForDb.__networkClient = client;

  await client.batch(SCHEMA, "write");
  return client;
}

export function getDb(): Promise<Client> {
  if (!globalForDb.__networkReady) {
    globalForDb.__networkReady = connect().catch((err) => {
      // Never cache a failed connection: the next request should retry.
      globalForDb.__networkReady = undefined;
      globalForDb.__networkClient = undefined;
      throw err;
    });
  }
  return globalForDb.__networkReady;
}

/** Run one statement and hand back typed rows. */
export async function query<T>(sql: string, args: InArgs = []): Promise<T[]> {
  const db = await getDb();
  const result = await db.execute({ sql, args });
  return result.rows as unknown as T[];
}

/** First row or null, for the many lookups that expect at most one. */
export async function queryOne<T>(
  sql: string,
  args: InArgs = [],
): Promise<T | null> {
  const rows = await query<T>(sql, args);
  return rows[0] ?? null;
}

/** Run one statement for its side effect; returns the new row id if any. */
export async function run(sql: string, args: InArgs = []): Promise<number | null> {
  const db = await getDb();
  const result = await db.execute({ sql, args });
  return result.lastInsertRowid === undefined
    ? null
    : Number(result.lastInsertRowid);
}

export const dbUrl = connectionUrl;
