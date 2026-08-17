/**
 * Plain-date helpers shared by the private dashboards.
 *
 * Everything on disk is a bare YYYY-MM-DD string in local terms, so the
 * arithmetic here stays pinned to UTC noon to dodge daylight-saving drift.
 */

export function toISODate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function todayISO(): string {
  return toISODate(new Date());
}

export function parseISO(iso: string): Date {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(Date.UTC(y, (m ?? 1) - 1, d ?? 1, 12));
}

export function addDays(iso: string, days: number): string {
  const d = parseISO(iso);
  d.setUTCDate(d.getUTCDate() + days);
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}-${String(
    d.getUTCDate(),
  ).padStart(2, "0")}`;
}

/** Whole days from `from` to `to`. Positive means `to` is later. */
export function daysBetween(from: string, to: string): number {
  return Math.round(
    (parseISO(to).getTime() - parseISO(from).getTime()) / 86_400_000,
  );
}

/** "3 months ago", "yesterday", "in 5 days". */
export function humanGap(days: number): string {
  const abs = Math.abs(days);
  let unit: string;
  if (abs === 0) return "today";
  if (abs === 1) unit = "1 day";
  else if (abs < 45) unit = `${abs} days`;
  else if (abs < 330) unit = `${Math.round(abs / 30)} months`;
  else {
    const years = abs / 365;
    unit = years < 1.75 ? "1 year" : `${Math.round(years)} years`;
  }
  return days < 0 ? `in ${unit}` : `${unit} ago`;
}

export function formatDate(iso: string): string {
  return parseISO(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
}

/** Monday of the ISO week `iso` falls in. */
export function weekStart(iso: string): string {
  const d = parseISO(iso);
  return addDays(iso, -((d.getUTCDay() + 6) % 7)); // Monday = 0
}
