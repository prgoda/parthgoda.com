import { DIMENSIONS } from "./types";
import type { CaseEntry, Dimension, ScoredCase, Score } from "./types";

/** What each 1-5 means, so the numbers stay comparable across months. */
export const SCORE_LABELS: Record<Score, string> = {
  1: "Fell apart",
  2: "Rough",
  3: "Solid, not sharp",
  4: "Strong",
  5: "Offer-worthy",
};

export function scoreLabel(value: number | null): string {
  if (value === null) return "Not scored";
  const rounded = Math.min(5, Math.max(1, Math.round(value))) as Score;
  return SCORE_LABELS[rounded];
}

/** Green above a 4, amber at a 3, red below. Used for every score chip and bar. */
export function scoreTone(
  value: number | null,
): "good" | "warn" | "alert" | "neutral" {
  if (value === null) return "neutral";
  if (value >= 4) return "good";
  if (value >= 3) return "warn";
  return "alert";
}

export function parseDrills(drills: string | null): string[] {
  if (!drills) return [];
  const seen = new Set<string>();
  return drills
    .split(",")
    .map((d) => d.trim())
    .filter((d) => {
      if (!d) return false;
      const key = d.toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
}

export function mean(values: number[]): number | null {
  if (values.length === 0) return null;
  return values.reduce((a, b) => a + b, 0) / values.length;
}

/** 3.75 → "7.5". One decimal, because half-points are how feedback is given. */
export function formatOutOfTen(value: number | null): string {
  if (value === null) return "—";
  const ten = value * 2;
  return Number.isInteger(ten) ? String(ten) : ten.toFixed(1);
}

export function formatAverage(value: number | null): string {
  return value === null ? "—" : value.toFixed(1);
}

/** Add the derived score fields a raw row does not carry. */
export function hydrate(row: CaseEntry): ScoredCase {
  const pairs = DIMENSIONS.map(
    (d) => [d, row[d]] as [Dimension, Score | null],
  ).filter((pair): pair is [Dimension, Score] => pair[1] !== null);

  const average = mean(pairs.map(([, v]) => v));
  const weakest =
    pairs.length === 0
      ? null
      : pairs.reduce((worst, pair) => (pair[1] < worst[1] ? pair : worst))[0];

  return {
    ...row,
    average,
    outOfTen: average === null ? null : Math.round(average * 20) / 10,
    scoredCount: pairs.length,
    weakest,
    drillList: parseDrills(row.drills),
  };
}

/**
 * Consecutive days ending today (or yesterday, so an evening of practice does
 * not get erased by the clock rolling over before you log it).
 */
export function currentStreak(dates: string[], today: string): number {
  const days = new Set(dates);
  if (!days.has(today)) {
    const yesterday = shift(today, -1);
    if (!days.has(yesterday)) return 0;
  }
  let cursor = days.has(today) ? today : shift(today, -1);
  let streak = 0;
  while (days.has(cursor)) {
    streak += 1;
    cursor = shift(cursor, -1);
  }
  return streak;
}

/** Longest run of consecutive practice days anywhere in the history. */
export function bestStreak(dates: string[]): number {
  const sorted = [...new Set(dates)].sort();
  let best = 0;
  let run = 0;
  let prev: string | null = null;
  for (const day of sorted) {
    run = prev !== null && shift(prev, 1) === day ? run + 1 : 1;
    if (run > best) best = run;
    prev = day;
  }
  return best;
}

function shift(iso: string, days: number): string {
  const [y, m, d] = iso.split("-").map(Number);
  const date = new Date(Date.UTC(y, (m ?? 1) - 1, d ?? 1, 12));
  date.setUTCDate(date.getUTCDate() + days);
  return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, "0")}-${String(
    date.getUTCDate(),
  ).padStart(2, "0")}`;
}

export function formatMinutes(total: number): string {
  if (total <= 0) return "0h";
  const hours = Math.floor(total / 60);
  const minutes = total % 60;
  if (hours === 0) return `${minutes}m`;
  if (minutes === 0) return `${hours}h`;
  return `${hours}h ${minutes}m`;
}
