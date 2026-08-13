import { getDb } from "./db";
import { computeDue, defaultCadenceFor, todayISO } from "./cadence";
import type {
  Closeness,
  ContactStatus,
  DashboardStats,
  Gender,
  Interaction,
  Person,
  PersonWithStatus,
} from "./types";

type StatusRow = Person & {
  last_contact: string | null;
  last_outbound: string | null;
  last_inbound: string | null;
  last_outbound_responded: 0 | 1 | null;
  interaction_count: number;
};

function hydrate(row: StatusRow, today = todayISO()): PersonWithStatus {
  const { due_on, days_overdue, status } = computeDue(
    row,
    row.last_contact,
    today,
  );
  return {
    ...row,
    due_on,
    days_overdue,
    status,
    days_since_contact:
      row.last_contact === null
        ? null
        : Math.max(
            0,
            Math.round(
              (Date.parse(`${today}T12:00:00Z`) -
                Date.parse(`${row.last_contact}T12:00:00Z`)) /
                86_400_000,
            ),
          ),
    never_contacted: row.interaction_count === 0,
    // Only the newest outbound matters, and only if it was never answered and
    // nothing has come back from them since.
    awaiting_reply:
      row.last_outbound !== null &&
      row.last_outbound_responded !== 1 &&
      (row.last_inbound === null || row.last_inbound < row.last_outbound),
  };
}

// ── reads ───────────────────────────────────────────────────────────────────

export interface PeopleFilters {
  search?: string;
  status?: ContactStatus | "all" | "never";
  closeness?: Closeness;
  whereMet?: string;
  tag?: string;
  archived?: boolean;
  sort?: "urgency" | "name" | "recent" | "closeness" | "added";
}

export function listPeople(filters: PeopleFilters = {}): PersonWithStatus[] {
  const where: string[] = ["archived = ?"];
  const params: unknown[] = [filters.archived ? 1 : 0];

  if (filters.search?.trim()) {
    const q = `%${filters.search.trim().toLowerCase()}%`;
    where.push(
      `(LOWER(name) LIKE ? OR LOWER(COALESCE(company,'')) LIKE ? OR LOWER(COALESCE(where_met,'')) LIKE ?
        OR LOWER(COALESCE(tags,'')) LIKE ? OR LOWER(COALESCE(email,'')) LIKE ?
        OR LOWER(COALESCE(notes,'')) LIKE ? OR LOWER(COALESCE(location,'')) LIKE ?)`,
    );
    params.push(q, q, q, q, q, q, q);
  }
  if (filters.closeness) {
    where.push("closeness = ?");
    params.push(filters.closeness);
  }
  if (filters.whereMet) {
    where.push("where_met = ?");
    params.push(filters.whereMet);
  }
  if (filters.tag) {
    where.push("LOWER(COALESCE(tags,'')) LIKE ?");
    params.push(`%${filters.tag.toLowerCase()}%`);
  }

  const rows = getDb()
    .prepare(`SELECT * FROM people_status WHERE ${where.join(" AND ")}`)
    .all(...params) as StatusRow[];

  const today = todayISO();
  let people = rows.map((r) => hydrate(r, today));

  if (filters.status && filters.status !== "all") {
    people =
      filters.status === "never"
        ? people.filter((p) => p.never_contacted)
        : people.filter((p) => p.status === filters.status);
  }

  const sort = filters.sort ?? "urgency";
  people.sort((a, b) => {
    switch (sort) {
      case "name":
        return a.name.localeCompare(b.name);
      case "closeness":
        return a.closeness - b.closeness || a.name.localeCompare(b.name);
      case "recent":
        return (b.last_contact ?? "").localeCompare(a.last_contact ?? "");
      case "added":
        return b.created_at.localeCompare(a.created_at);
      default:
        // Snoozed people sink; otherwise most overdue first.
        if ((a.status === "snoozed") !== (b.status === "snoozed"))
          return a.status === "snoozed" ? 1 : -1;
        return b.days_overdue - a.days_overdue || a.closeness - b.closeness;
    }
  });

  return people;
}

export function getPerson(id: number): PersonWithStatus | null {
  const row = getDb()
    .prepare("SELECT * FROM people_status WHERE id = ?")
    .get(id) as StatusRow | undefined;
  return row ? hydrate(row) : null;
}

export function getInteractions(personId: number): Interaction[] {
  return getDb()
    .prepare(
      "SELECT * FROM interactions WHERE person_id = ? ORDER BY occurred_on DESC, id DESC",
    )
    .all(personId) as Interaction[];
}

/** Everyone owed a touch right now, most overdue first. Used by the mailer. */
export function listDue(includeSnoozed = false): PersonWithStatus[] {
  return listPeople({ sort: "urgency" }).filter(
    (p) =>
      p.status === "overdue" || (includeSnoozed && p.status === "snoozed"),
  );
}

export function distinctWhereMet(): { value: string; count: number }[] {
  return getDb()
    .prepare(
      `SELECT where_met AS value, COUNT(*) AS count FROM people
       WHERE archived = 0 AND where_met IS NOT NULL AND TRIM(where_met) <> ''
       GROUP BY where_met ORDER BY count DESC, value ASC`,
    )
    .all() as { value: string; count: number }[];
}

export function distinctTags(): string[] {
  const rows = getDb()
    .prepare(
      "SELECT tags FROM people WHERE archived = 0 AND tags IS NOT NULL AND TRIM(tags) <> ''",
    )
    .all() as { tags: string }[];
  const set = new Set<string>();
  for (const r of rows)
    for (const t of r.tags.split(",")) {
      const clean = t.trim();
      if (clean) set.add(clean);
    }
  return [...set].sort((a, b) => a.localeCompare(b));
}

// ── dashboard ───────────────────────────────────────────────────────────────

export function dashboardStats(): DashboardStats {
  const db = getDb();
  const today = todayISO();
  const year = today.slice(0, 4);
  const yearStart = `${year}-01-01`;

  const active = listPeople({ sort: "urgency" });

  const archivedPeople = (
    db.prepare("SELECT COUNT(*) AS n FROM people WHERE archived = 1").get() as {
      n: number;
    }
  ).n;

  const peopleReachedThisYear = (
    db
      .prepare(
        `SELECT COUNT(DISTINCT i.person_id) AS n FROM interactions i
         JOIN people p ON p.id = i.person_id
         WHERE i.occurred_on >= ? AND p.archived = 0`,
      )
      .get(yearStart) as { n: number }
  ).n;

  const interactionsThisYear = (
    db
      .prepare("SELECT COUNT(*) AS n FROM interactions WHERE occurred_on >= ?")
      .get(yearStart) as { n: number }
  ).n;

  const interactionsLast30 = (
    db
      .prepare("SELECT COUNT(*) AS n FROM interactions WHERE occurred_on >= date(?, '-30 days')")
      .get(today) as { n: number }
  ).n;

  const outbound = db
    .prepare(
      `SELECT COUNT(*) AS total, SUM(responded) AS replied FROM interactions
       WHERE direction = 'outbound' AND occurred_on >= date(?, '-365 days')`,
    )
    .get(today) as { total: number; replied: number | null };

  const monthly = db
    .prepare(
      `SELECT substr(occurred_on, 1, 7) AS month, COUNT(*) AS count
       FROM interactions WHERE occurred_on >= date(?, '-11 months', 'start of month')
       GROUP BY month ORDER BY month ASC`,
    )
    .all(today) as { month: string; count: number }[];

  // Fill gaps so the bar chart keeps a stable 12-slot shape.
  const months: { month: string; count: number }[] = [];
  const cursor = new Date(Date.UTC(Number(year), Number(today.slice(5, 7)) - 1, 1, 12));
  cursor.setUTCMonth(cursor.getUTCMonth() - 11);
  for (let i = 0; i < 12; i++) {
    const key = `${cursor.getUTCFullYear()}-${String(cursor.getUTCMonth() + 1).padStart(2, "0")}`;
    months.push({ month: key, count: monthly.find((m) => m.month === key)?.count ?? 0 });
    cursor.setUTCMonth(cursor.getUTCMonth() + 1);
  }

  const byWhereMet = distinctWhereMet().slice(0, 8).map((w) => ({
    where_met: w.value,
    count: w.count,
  }));

  const byGender = (
    db
      .prepare(
        `SELECT gender, COUNT(*) AS count FROM people WHERE archived = 0
         GROUP BY gender ORDER BY count DESC`,
      )
      .all() as { gender: Gender; count: number }[]
  );

  const byCloseness = ([1, 2, 3, 4, 5] as Closeness[]).map((c) => ({
    closeness: c,
    count: active.filter((p) => p.closeness === c).length,
    overdue: active.filter((p) => p.closeness === c && p.status === "overdue").length,
  }));

  const gaps = active
    .map((p) => p.days_since_contact)
    .filter((d): d is number => d !== null)
    .sort((a, b) => a - b);

  return {
    totalPeople: active.length,
    archivedPeople,
    overdue: active.filter((p) => p.status === "overdue").length,
    dueSoon: active.filter((p) => p.status === "due-soon").length,
    neverContacted: active.filter((p) => p.never_contacted).length,
    awaitingReply: active.filter((p) => p.awaiting_reply).length,
    peopleReachedThisYear,
    interactionsThisYear,
    interactionsLast30,
    outboundLast365: outbound.total,
    respondedLast365: outbound.replied ?? 0,
    responseRate: outbound.total ? (outbound.replied ?? 0) / outbound.total : null,
    medianDaysSinceContact: gaps.length ? gaps[Math.floor(gaps.length / 2)] : null,
    byCloseness,
    byWhereMet,
    byGender,
    monthly: months,
    longestSilences: active
      .filter((p) => !p.never_contacted)
      .sort((a, b) => (b.days_since_contact ?? 0) - (a.days_since_contact ?? 0))
      .slice(0, 8),
  };
}

// ── writes ──────────────────────────────────────────────────────────────────

export type PersonInput = Omit<
  Person,
  "id" | "created_at" | "updated_at" | "archived"
> & { archived?: 0 | 1 };

export function createPerson(input: PersonInput): number {
  const now = new Date().toISOString();
  const info = getDb()
    .prepare(
      `INSERT INTO people
        (name, gender, email, phone, linkedin, company, role, location, where_met,
         met_year, closeness, cadence_days, tags, notes, archived, snooze_until,
         created_at, updated_at)
       VALUES
        (@name, @gender, @email, @phone, @linkedin, @company, @role, @location, @where_met,
         @met_year, @closeness, @cadence_days, @tags, @notes, @archived, @snooze_until,
         @created_at, @updated_at)`,
    )
    .run({
      ...input,
      archived: input.archived ?? 0,
      created_at: now,
      updated_at: now,
    });
  return Number(info.lastInsertRowid);
}

export function updatePerson(id: number, input: PersonInput): void {
  getDb()
    .prepare(
      `UPDATE people SET
        name = @name, gender = @gender, email = @email, phone = @phone,
        linkedin = @linkedin, company = @company, role = @role, location = @location,
        where_met = @where_met, met_year = @met_year, closeness = @closeness,
        cadence_days = @cadence_days, tags = @tags, notes = @notes,
        snooze_until = @snooze_until, updated_at = @updated_at
       WHERE id = @id`,
    )
    .run({ ...input, id, updated_at: new Date().toISOString() });
}

export function setArchived(id: number, archived: boolean): void {
  getDb()
    .prepare("UPDATE people SET archived = ?, updated_at = ? WHERE id = ?")
    .run(archived ? 1 : 0, new Date().toISOString(), id);
}

export function deletePerson(id: number): void {
  getDb().prepare("DELETE FROM people WHERE id = ?").run(id);
}

export function snoozePerson(id: number, until: string | null): void {
  getDb()
    .prepare("UPDATE people SET snooze_until = ?, updated_at = ? WHERE id = ?")
    .run(until, new Date().toISOString(), id);
}

export type InteractionInput = Omit<Interaction, "id" | "created_at">;

export function logInteraction(input: InteractionInput): number {
  const info = getDb()
    .prepare(
      `INSERT INTO interactions (person_id, occurred_on, direction, channel, responded, note, created_at)
       VALUES (@person_id, @occurred_on, @direction, @channel, @responded, @note, @created_at)`,
    )
    .run({ ...input, created_at: new Date().toISOString() });
  // Logging a touch clears any snooze; the clock has legitimately restarted.
  getDb()
    .prepare("UPDATE people SET snooze_until = NULL, updated_at = ? WHERE id = ?")
    .run(new Date().toISOString(), input.person_id);
  return Number(info.lastInsertRowid);
}

export function markResponded(interactionId: number, responded: boolean): void {
  getDb()
    .prepare("UPDATE interactions SET responded = ? WHERE id = ?")
    .run(responded ? 1 : 0, interactionId);
}

export function deleteInteraction(id: number): void {
  getDb().prepare("DELETE FROM interactions WHERE id = ?").run(id);
}

export { defaultCadenceFor };
