import type { Closeness, ContactStatus, Gender, Person } from "./types";

/** Relationship tiers. The cadence is a default, always overridable per person. */
export const CLOSENESS_TIERS: {
  value: Closeness;
  label: string;
  blurb: string;
  defaultCadenceDays: number;
}[] = [
  {
    value: 1,
    label: "Inner circle",
    blurb: "Family and the handful of people you would call at 2am.",
    defaultCadenceDays: 14,
  },
  {
    value: 2,
    label: "Close",
    blurb: "Good friends, mentors, people you want in your week-to-week.",
    defaultCadenceDays: 45,
  },
  {
    value: 3,
    label: "Active",
    blurb: "Colleagues and friends worth a real check-in a few times a year.",
    defaultCadenceDays: 90,
  },
  {
    value: 4,
    label: "Periphery",
    blurb: "Warm contacts. Twice a year keeps the line open.",
    defaultCadenceDays: 180,
  },
  {
    value: 5,
    label: "Distant",
    blurb: "People you would like to not lose entirely. Once a year.",
    defaultCadenceDays: 365,
  },
];

export const CADENCE_PRESETS: { label: string; days: number }[] = [
  { label: "Weekly", days: 7 },
  { label: "Fortnightly", days: 14 },
  { label: "Monthly", days: 30 },
  { label: "Every 6 weeks", days: 45 },
  { label: "Quarterly", days: 90 },
  { label: "Twice a year", days: 180 },
  { label: "Yearly", days: 365 },
  { label: "Every 2 years", days: 730 },
];

/** Days before the due date that a person starts showing up as "due soon". */
export const DUE_SOON_WINDOW_DAYS = 14;

export function closenessTier(value: Closeness) {
  return CLOSENESS_TIERS.find((t) => t.value === value) ?? CLOSENESS_TIERS[2];
}

export function closenessLabel(value: Closeness): string {
  return closenessTier(value).label;
}

export function defaultCadenceFor(closeness: Closeness): number {
  return closenessTier(closeness).defaultCadenceDays;
}

export function cadenceLabel(days: number): string {
  const preset = CADENCE_PRESETS.find((p) => p.days === days);
  if (preset) return preset.label;
  if (days % 365 === 0) return `Every ${days / 365} years`;
  if (days % 30 === 0) return `Every ${days / 30} months`;
  return `Every ${days} days`;
}

export const GENDER_LABELS: Record<Gender, string> = {
  female: "Female",
  male: "Male",
  nonbinary: "Non-binary",
  unspecified: "Not recorded",
};

// ── date helpers ────────────────────────────────────────────────────────────
// Everything is stored as a plain YYYY-MM-DD string in local terms, so the
// arithmetic here stays in UTC-noon to dodge daylight-saving drift.

export function todayISO(): string {
  return toISODate(new Date());
}

export function toISODate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function parseISO(iso: string): Date {
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

// ── status ──────────────────────────────────────────────────────────────────

/**
 * When there is no logged contact we anchor the clock to the day the person was
 * added, so a fresh import does not turn the whole dashboard red on day one.
 */
export function computeDue(
  person: Pick<Person, "cadence_days" | "created_at" | "snooze_until">,
  lastContact: string | null,
  today = todayISO(),
): { due_on: string; days_overdue: number; status: ContactStatus } {
  const anchor = lastContact ?? person.created_at.slice(0, 10);
  const due_on = addDays(anchor, person.cadence_days);
  const days_overdue = daysBetween(due_on, today);

  let status: ContactStatus;
  if (person.snooze_until && person.snooze_until > today) status = "snoozed";
  else if (days_overdue >= 0) status = "overdue";
  else if (days_overdue >= -DUE_SOON_WINDOW_DAYS) status = "due-soon";
  else status = "ok";

  return { due_on, days_overdue, status };
}
