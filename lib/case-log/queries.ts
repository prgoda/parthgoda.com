import { daysBetween, todayISO, weekStart } from "@/lib/dates";
import { query, queryOne, run } from "./db";
import {
  bestStreak,
  currentStreak,
  hydrate,
  mean,
  parseDrills,
} from "./scoring";
import {
  CASE_TYPES,
  DIMENSIONS,
  type CaseEntry,
  type CaseLogStats,
  type CaseType,
  type DimensionStat,
  type Firm,
  type Format,
  type NamedStat,
  type Role,
  type Score,
  type ScoredCase,
  type Style,
  type TypeStat,
} from "./types";

const COLUMNS = `id, practiced_on, title, prompt, source, firm, style, case_type,
  industry, partner, role, format, minutes, structure, math, insight, synthesis,
  presence, went_well, to_fix, drills, notes, created_at, updated_at`;

// ── reads ───────────────────────────────────────────────────────────────────

export interface CaseFilters {
  search?: string;
  caseType?: CaseType;
  firm?: Firm;
  partner?: string;
  role?: Role;
  format?: Format;
  drill?: string;
  /** Keep only cases whose average is at or below this, to find the weak reps. */
  maxAverage?: number;
  sort?: "recent" | "oldest" | "best" | "worst" | "type";
}

export async function listCases(
  filters: CaseFilters = {},
): Promise<ScoredCase[]> {
  const where: string[] = [];
  const params: (string | number)[] = [];

  if (filters.search?.trim()) {
    const q = `%${filters.search.trim().toLowerCase()}%`;
    where.push(
      `(LOWER(title) LIKE ? OR LOWER(COALESCE(prompt,'')) LIKE ?
        OR LOWER(COALESCE(source,'')) LIKE ? OR LOWER(COALESCE(industry,'')) LIKE ?
        OR LOWER(COALESCE(partner,'')) LIKE ? OR LOWER(COALESCE(went_well,'')) LIKE ?
        OR LOWER(COALESCE(to_fix,'')) LIKE ? OR LOWER(COALESCE(drills,'')) LIKE ?
        OR LOWER(COALESCE(notes,'')) LIKE ?)`,
    );
    params.push(q, q, q, q, q, q, q, q, q);
  }
  if (filters.caseType) {
    where.push("case_type = ?");
    params.push(filters.caseType);
  }
  if (filters.firm) {
    where.push("firm = ?");
    params.push(filters.firm);
  }
  if (filters.partner) {
    where.push("partner = ?");
    params.push(filters.partner);
  }
  if (filters.role) {
    where.push("role = ?");
    params.push(filters.role);
  }
  if (filters.format) {
    where.push("format = ?");
    params.push(filters.format);
  }
  if (filters.drill) {
    where.push("LOWER(COALESCE(drills,'')) LIKE ?");
    params.push(`%${filters.drill.toLowerCase()}%`);
  }

  const rows = await query<CaseEntry>(
    `SELECT ${COLUMNS} FROM cases${
      where.length ? ` WHERE ${where.join(" AND ")}` : ""
    }`,
    params,
  );

  let cases = rows.map(hydrate);

  if (filters.maxAverage !== undefined) {
    const cap = filters.maxAverage;
    cases = cases.filter((c) => c.average !== null && c.average <= cap);
  }

  const sort = filters.sort ?? "recent";
  cases.sort((a, b) => {
    switch (sort) {
      case "oldest":
        return cmpDate(a, b);
      case "best":
        return cmpScore(b, a) || -cmpDate(a, b);
      case "worst":
        return cmpScore(a, b) || -cmpDate(a, b);
      case "type":
        return a.case_type.localeCompare(b.case_type) || -cmpDate(a, b);
      default:
        return -cmpDate(a, b);
    }
  });

  return cases;
}

function cmpDate(a: ScoredCase, b: ScoredCase): number {
  return a.practiced_on.localeCompare(b.practiced_on) || a.id - b.id;
}

/** Unscored cases sink to the bottom either way. */
function cmpScore(a: ScoredCase, b: ScoredCase): number {
  if (a.average === null && b.average === null) return 0;
  if (a.average === null) return 1;
  if (b.average === null) return -1;
  return a.average - b.average;
}

export async function getCase(id: number): Promise<ScoredCase | null> {
  const row = await queryOne<CaseEntry>(
    `SELECT ${COLUMNS} FROM cases WHERE id = ?`,
    [id],
  );
  return row ? hydrate(row) : null;
}

/** The case logged immediately before this one, for "what did I say I'd fix". */
export async function previousCase(
  entry: ScoredCase,
): Promise<ScoredCase | null> {
  const row = await queryOne<CaseEntry>(
    `SELECT ${COLUMNS} FROM cases
     WHERE (practiced_on < ?) OR (practiced_on = ? AND id < ?)
     ORDER BY practiced_on DESC, id DESC LIMIT 1`,
    [entry.practiced_on, entry.practiced_on, entry.id],
  );
  return row ? hydrate(row) : null;
}

export async function distinctPartners(): Promise<string[]> {
  const rows = await query<{ partner: string }>(
    `SELECT DISTINCT partner FROM cases
     WHERE partner IS NOT NULL AND TRIM(partner) <> ''
     ORDER BY LOWER(partner)`,
  );
  return rows.map((r) => r.partner);
}

export async function distinctSources(): Promise<string[]> {
  const rows = await query<{ source: string }>(
    `SELECT DISTINCT source FROM cases
     WHERE source IS NOT NULL AND TRIM(source) <> ''
     ORDER BY LOWER(source)`,
  );
  return rows.map((r) => r.source);
}

// ── stats ───────────────────────────────────────────────────────────────────

/**
 * One read, everything computed in memory. A practice log tops out in the low
 * hundreds of rows, so this stays cheaper than a dozen aggregate round trips.
 */
export async function caseLogStats(): Promise<CaseLogStats> {
  const rows = await query<CaseEntry>(
    `SELECT ${COLUMNS} FROM cases ORDER BY practiced_on DESC, id DESC`,
  );
  const all = rows.map(hydrate);
  const today = todayISO();

  const scored = all.filter((c) => c.average !== null);
  // Oldest-first, so "last 5" means the five most recent scored reps.
  const scoredChrono = [...scored].reverse();
  const last5 = scoredChrono.slice(-5);
  const prev5 = scoredChrono.slice(-10, -5);

  const dates = all.map((c) => c.practiced_on);

  return {
    totalCases: all.length,
    taken: all.filter((c) => c.role === "interviewee").length,
    given: all.filter((c) => c.role === "interviewer").length,
    casesLast7: all.filter((c) => daysBetween(c.practiced_on, today) < 7).length,
    casesLast30: all.filter((c) => daysBetween(c.practiced_on, today) < 30)
      .length,
    totalMinutes: all.reduce((sum, c) => sum + (c.minutes ?? 0), 0),
    streakDays: currentStreak(dates, today),
    bestStreakDays: bestStreak(dates),
    average: mean(scored.map((c) => c.average as number)),
    averageLast5: mean(last5.map((c) => c.average as number)),
    averagePrev5: mean(prev5.map((c) => c.average as number)),
    best:
      scored.length === 0
        ? null
        : scored.reduce((top, c) =>
            (c.average as number) > (top.average as number) ? c : top,
          ),
    firstPracticed: all.length ? all[all.length - 1].practiced_on : null,
    lastPracticed: all.length ? all[0].practiced_on : null,
    byDimension: dimensionStats(all),
    byType: typeStats(all),
    untouchedTypes: CASE_TYPES.filter(
      (t) => !all.some((c) => c.case_type === t),
    ),
    byPartner: namedStats(all, (c) => c.partner),
    bySource: namedStats(all, (c) => c.source),
    byFirm: namedStats(all, (c) => c.firm),
    weekly: weeklyCounts(all, today),
    topDrills: drillCounts(all),
    recent: all.slice(0, 8),
    // Latest reps that left a note on what to work on.
    openFixes: all.filter((c) => c.to_fix?.trim()).slice(0, 5),
  };
}

function dimensionStats(all: ScoredCase[]): DimensionStat[] {
  return DIMENSIONS.map((dimension) => {
    // Oldest first so slice(-5) is the newest five with this dimension filled in.
    const values = [...all]
      .reverse()
      .map((c) => c[dimension])
      .filter((v): v is Score => v !== null);
    return {
      dimension,
      average: mean(values),
      count: values.length,
      recentAverage: mean(values.slice(-5)),
    };
  });
}

function typeStats(all: ScoredCase[]): TypeStat[] {
  const seen = new Map<CaseType, ScoredCase[]>();
  for (const c of all) {
    const bucket = seen.get(c.case_type);
    if (bucket) bucket.push(c);
    else seen.set(c.case_type, [c]);
  }
  return [...seen.entries()]
    .map(([case_type, cases]) => ({
      case_type,
      count: cases.length,
      average: mean(
        cases.filter((c) => c.average !== null).map((c) => c.average as number),
      ),
      // `all` arrives newest-first, so each bucket keeps that order.
      lastPracticed: cases[0]?.practiced_on ?? null,
    }))
    .sort((a, b) => b.count - a.count || a.case_type.localeCompare(b.case_type));
}

function namedStats(
  all: ScoredCase[],
  pick: (c: ScoredCase) => string | null,
): NamedStat[] {
  const buckets = new Map<string, { name: string; cases: ScoredCase[] }>();
  for (const c of all) {
    const raw = pick(c)?.trim();
    if (!raw) continue;
    const key = raw.toLowerCase();
    const bucket = buckets.get(key);
    if (bucket) bucket.cases.push(c);
    else buckets.set(key, { name: raw, cases: [c] });
  }
  return [...buckets.values()]
    .map(({ name, cases }) => ({
      name,
      count: cases.length,
      average: mean(
        cases.filter((c) => c.average !== null).map((c) => c.average as number),
      ),
    }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name))
    .slice(0, 8);
}

/** Twelve buckets, always, so the chart keeps its shape on a quiet fortnight. */
function weeklyCounts(
  all: ScoredCase[],
  today: string,
): { week: string; count: number; average: number | null }[] {
  const thisWeek = weekStart(today);
  const weeks: string[] = [];
  for (let i = 11; i >= 0; i--) weeks.push(shiftWeeks(thisWeek, -i));

  return weeks.map((week) => {
    const inWeek = all.filter((c) => weekStart(c.practiced_on) === week);
    return {
      week,
      count: inWeek.length,
      average: mean(
        inWeek.filter((c) => c.average !== null).map((c) => c.average as number),
      ),
    };
  });
}

function shiftWeeks(iso: string, weeks: number): string {
  const [y, m, d] = iso.split("-").map(Number);
  const date = new Date(Date.UTC(y, (m ?? 1) - 1, d ?? 1, 12));
  date.setUTCDate(date.getUTCDate() + weeks * 7);
  return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, "0")}-${String(
    date.getUTCDate(),
  ).padStart(2, "0")}`;
}

function drillCounts(all: ScoredCase[]): { tag: string; count: number }[] {
  const counts = new Map<string, { tag: string; count: number }>();
  for (const c of all) {
    for (const tag of parseDrills(c.drills)) {
      const key = tag.toLowerCase();
      const hit = counts.get(key);
      if (hit) hit.count += 1;
      else counts.set(key, { tag, count: 1 });
    }
  }
  return [...counts.values()]
    .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag))
    .slice(0, 12);
}

// ── writes ──────────────────────────────────────────────────────────────────

export interface CaseInput {
  practiced_on: string;
  title: string;
  prompt: string | null;
  source: string | null;
  firm: Firm | null;
  style: Style;
  case_type: CaseType;
  industry: string | null;
  partner: string | null;
  role: Role;
  format: Format;
  minutes: number | null;
  structure: Score | null;
  math: Score | null;
  insight: Score | null;
  synthesis: Score | null;
  presence: Score | null;
  went_well: string | null;
  to_fix: string | null;
  drills: string | null;
  notes: string | null;
}

function values(input: CaseInput): (string | number | null)[] {
  return [
    input.practiced_on,
    input.title,
    input.prompt,
    input.source,
    input.firm,
    input.style,
    input.case_type,
    input.industry,
    input.partner,
    input.role,
    input.format,
    input.minutes,
    input.structure,
    input.math,
    input.insight,
    input.synthesis,
    input.presence,
    input.went_well,
    input.to_fix,
    input.drills,
    input.notes,
  ];
}

const FIELDS = `practiced_on, title, prompt, source, firm, style, case_type,
  industry, partner, role, format, minutes, structure, math, insight, synthesis,
  presence, went_well, to_fix, drills, notes`;

export async function createCase(input: CaseInput): Promise<number> {
  const now = new Date().toISOString();
  const id = await run(
    `INSERT INTO cases (${FIELDS}, created_at, updated_at)
     VALUES (${"?, ".repeat(21)}?, ?)`,
    [...values(input), now, now],
  );
  return id ?? 0;
}

export async function updateCase(id: number, input: CaseInput): Promise<void> {
  const assignments = FIELDS.split(",")
    .map((f) => `${f.trim()} = ?`)
    .join(", ");
  await run(
    `UPDATE cases SET ${assignments}, updated_at = ? WHERE id = ?`,
    [...values(input), new Date().toISOString(), id],
  );
}

export async function deleteCase(id: number): Promise<void> {
  await run(`DELETE FROM cases WHERE id = ?`, [id]);
}
