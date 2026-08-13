export const GENDERS = ["female", "male", "nonbinary", "unspecified"] as const;
export type Gender = (typeof GENDERS)[number];

export const CHANNELS = [
  "in-person",
  "call",
  "text",
  "whatsapp",
  "email",
  "linkedin",
  "other",
] as const;
export type Channel = (typeof CHANNELS)[number];

export const DIRECTIONS = ["outbound", "inbound"] as const;
export type Direction = (typeof DIRECTIONS)[number];

/** 1 = inner circle, 5 = distant acquaintance. */
export type Closeness = 1 | 2 | 3 | 4 | 5;

export type ContactStatus = "overdue" | "due-soon" | "ok" | "snoozed";

export interface Person {
  id: number;
  name: string;
  gender: Gender;
  email: string | null;
  phone: string | null;
  linkedin: string | null;
  company: string | null;
  role: string | null;
  location: string | null;
  /** Free text: "Formlabs", "IIM Bangalore intake", "Army, 2019". */
  where_met: string | null;
  /** Rough year the relationship started. */
  met_year: number | null;
  closeness: Closeness;
  /** Target days between touches. */
  cadence_days: number;
  /** Comma-separated. */
  tags: string | null;
  notes: string | null;
  archived: 0 | 1;
  /** ISO date; reminders stay quiet until then. */
  snooze_until: string | null;
  created_at: string;
  updated_at: string;
}

export interface Interaction {
  id: number;
  person_id: number;
  occurred_on: string;
  direction: Direction;
  channel: Channel;
  /** Only meaningful for outbound: did they write back. */
  responded: 0 | 1;
  note: string | null;
  created_at: string;
}

/** A person joined with everything derived from their interaction history. */
export interface PersonWithStatus extends Person {
  last_contact: string | null;
  last_outbound: string | null;
  last_inbound: string | null;
  interaction_count: number;
  /** Date the next touch is owed. */
  due_on: string;
  /** Positive = days late, negative = days of runway left. */
  days_overdue: number;
  /** Days since the last touch of any kind; null if never contacted. */
  days_since_contact: number | null;
  status: ContactStatus;
  /** True when there is no logged interaction at all. */
  never_contacted: boolean;
  /** Outbound with no reply, most recent first. */
  awaiting_reply: boolean;
}

export interface DashboardStats {
  totalPeople: number;
  archivedPeople: number;
  overdue: number;
  dueSoon: number;
  neverContacted: number;
  awaitingReply: number;
  /** Distinct people touched since Jan 1 of the current year. */
  peopleReachedThisYear: number;
  interactionsThisYear: number;
  interactionsLast30: number;
  outboundLast365: number;
  respondedLast365: number;
  responseRate: number | null;
  medianDaysSinceContact: number | null;
  byCloseness: { closeness: Closeness; count: number; overdue: number }[];
  byWhereMet: { where_met: string; count: number }[];
  byGender: { gender: Gender; count: number }[];
  monthly: { month: string; count: number }[];
  longestSilences: PersonWithStatus[];
}
