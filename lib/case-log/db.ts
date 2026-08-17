import type { Client, InArgs } from "@libsql/client";

/**
 * Same two-homes trick as /network: a plain SQLite file under data/ locally,
 * Turso over HTTP in production. Set CASELOG_TURSO_DATABASE_URL to give the
 * case log its own database; otherwise it shares the one /network uses, which
 * is harmless since the table names do not collide.
 */
function connectionUrl(): string {
  const turso =
    process.env.CASELOG_TURSO_DATABASE_URL?.trim() ||
    process.env.TURSO_DATABASE_URL?.trim();
  if (turso) return turso;
  const file = process.env.CASELOG_DB_PATH?.trim() ?? "data/case-log.db";
  return file.startsWith("file:") ? file : `file:${file}`;
}

function authToken(): string | undefined {
  return process.env.CASELOG_TURSO_DATABASE_URL?.trim()
    ? process.env.CASELOG_TURSO_AUTH_TOKEN
    : process.env.TURSO_AUTH_TOKEN;
}

export function isRemote(): boolean {
  return !connectionUrl().startsWith("file:");
}

const SCHEMA: string[] = [
  `CREATE TABLE IF NOT EXISTS cases (
    id           INTEGER PRIMARY KEY AUTOINCREMENT,
    practiced_on TEXT    NOT NULL,
    title        TEXT    NOT NULL,
    prompt       TEXT,
    source       TEXT,
    firm         TEXT,
    style        TEXT    NOT NULL DEFAULT 'unsure',
    case_type    TEXT    NOT NULL DEFAULT 'other',
    industry     TEXT,
    partner      TEXT,
    role         TEXT    NOT NULL DEFAULT 'interviewee',
    format       TEXT    NOT NULL DEFAULT 'video',
    minutes      INTEGER,
    structure    INTEGER,
    math         INTEGER,
    insight      INTEGER,
    synthesis    INTEGER,
    presence     INTEGER,
    went_well    TEXT,
    to_fix       TEXT,
    drills       TEXT,
    notes        TEXT,
    created_at   TEXT    NOT NULL,
    updated_at   TEXT    NOT NULL
  )`,
  `CREATE INDEX IF NOT EXISTS idx_cases_date ON cases(practiced_on DESC, id DESC)`,
  `CREATE INDEX IF NOT EXISTS idx_cases_type ON cases(case_type)`,
  `CREATE INDEX IF NOT EXISTS idx_cases_partner ON cases(partner)`,
];

// One client and one schema run per process, not per request or per hot reload.
const globalForDb = globalThis as unknown as {
  __caseLogClient?: Client;
  __caseLogReady?: Promise<Client>;
};

/**
 * A local file needs libSQL's native binding; remote Turso only needs HTTP.
 * Choosing the entry point per URL keeps native code out of the serverless bundle.
 */
async function createDbClient(url: string): Promise<Client> {
  if (url.startsWith("file:")) {
    const { createClient } = await import("@libsql/client");
    return createClient({ url });
  }
  const { createClient } = await import("@libsql/client/web");
  return createClient({ url, authToken: authToken() });
}

async function connect(): Promise<Client> {
  const client =
    globalForDb.__caseLogClient ?? (await createDbClient(connectionUrl()));
  globalForDb.__caseLogClient = client;

  await client.batch(SCHEMA, "write");
  return client;
}

export function getDb(): Promise<Client> {
  if (!globalForDb.__caseLogReady) {
    globalForDb.__caseLogReady = connect().catch((err) => {
      // Never cache a failed connection: the next request should retry.
      globalForDb.__caseLogReady = undefined;
      globalForDb.__caseLogClient = undefined;
      throw err;
    });
  }
  return globalForDb.__caseLogReady;
}

/** Run one statement and hand back typed rows. */
export async function query<T>(sql: string, args: InArgs = []): Promise<T[]> {
  const db = await getDb();
  const result = await db.execute({ sql, args });
  return result.rows as unknown as T[];
}

/** First row or null, for the lookups that expect at most one. */
export async function queryOne<T>(
  sql: string,
  args: InArgs = [],
): Promise<T | null> {
  const rows = await query<T>(sql, args);
  return rows[0] ?? null;
}

/** Run one statement for its side effect; returns the new row id if any. */
export async function run(
  sql: string,
  args: InArgs = [],
): Promise<number | null> {
  const db = await getDb();
  const result = await db.execute({ sql, args });
  return result.lastInsertRowid === undefined
    ? null
    : Number(result.lastInsertRowid);
}

export const dbUrl = connectionUrl;
