import { addDays, daysBetween, todayISO } from "@/lib/dates";
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
// These live in lib/dates.ts now, shared with the other private dashboards.
// Re-exported here so every existing `from "@/lib/network/cadence"` still works.

export {
  addDays,
  daysBetween,
  formatDate,
  humanGap,
  parseISO,
  toISODate,
  todayISO,
} from "@/lib/dates";

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
