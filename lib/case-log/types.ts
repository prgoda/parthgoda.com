/** The kinds of case you get asked. Order is roughly how often they show up. */
export const CASE_TYPES = [
  "profitability",
  "market-entry",
  "market-sizing",
  "revenue-growth",
  "pricing",
  "cost-reduction",
  "m-and-a",
  "new-product",
  "operations",
  "private-equity",
  "turnaround",
  "org-people",
  "non-profit",
  "other",
] as const;
export type CaseType = (typeof CASE_TYPES)[number];

export const CASE_TYPE_LABELS: Record<CaseType, string> = {
  profitability: "Profitability",
  "market-entry": "Market entry",
  "market-sizing": "Market sizing",
  "revenue-growth": "Revenue growth",
  pricing: "Pricing",
  "cost-reduction": "Cost reduction",
  "m-and-a": "M&A / due diligence",
  "new-product": "New product",
  operations: "Operations",
  "private-equity": "PE / investment",
  turnaround: "Turnaround",
  "org-people": "Org & people",
  "non-profit": "Non-profit / public",
  other: "Other",
};

/** Whose interview style the case was run in. */
export const FIRMS = [
  "mckinsey",
  "bain",
  "bcg",
  "deloitte",
  "kearney",
  "ey-parthenon",
  "accenture",
  "other",
] as const;
export type Firm = (typeof FIRMS)[number];

export const FIRM_LABELS: Record<Firm, string> = {
  mckinsey: "McKinsey",
  bain: "Bain",
  bcg: "BCG",
  deloitte: "Deloitte",
  kearney: "Kearney",
  "ey-parthenon": "EY-Parthenon",
  accenture: "Accenture",
  other: "Other / generic",
};

/** Interviewer-led (McKinsey) vs candidate-led (Bain, BCG) changes how you drive. */
export const STYLES = ["interviewer-led", "candidate-led", "unsure"] as const;
export type Style = (typeof STYLES)[number];

export const STYLE_LABELS: Record<Style, string> = {
  "interviewer-led": "Interviewer-led",
  "candidate-led": "Candidate-led",
  unsure: "Not recorded",
};

export const FORMATS = ["in-person", "video", "phone", "solo", "written"] as const;
export type Format = (typeof FORMATS)[number];

export const FORMAT_LABELS: Record<Format, string> = {
  "in-person": "In person",
  video: "Video",
  phone: "Phone",
  solo: "Solo drill",
  written: "Written",
};

/** Taking the case or giving it. Both count as reps; only one gets scored. */
export const ROLES = ["interviewee", "interviewer"] as const;
export type Role = (typeof ROLES)[number];

export const ROLE_LABELS: Record<Role, string> = {
  interviewee: "I took it",
  interviewer: "I gave it",
};

/** 1 = fell apart, 5 = offer-worthy. Null means the round was not scored. */
export type Score = 1 | 2 | 3 | 4 | 5;

/**
 * The five things partners actually write on the feedback sheet. Keeping them
 * separate is the whole point: an average of 7/10 hides that the math is a 3.
 */
export const DIMENSIONS = [
  "structure",
  "math",
  "insight",
  "synthesis",
  "presence",
] as const;
export type Dimension = (typeof DIMENSIONS)[number];

export const DIMENSION_META: Record<
  Dimension,
  { label: string; blurb: string }
> = {
  structure: {
    label: "Structure",
    blurb: "MECE, tailored to the prompt, driven to a hypothesis.",
  },
  math: {
    label: "Math",
    blurb: "Set it up cleanly, no arithmetic slips, sanity-checked.",
  },
  insight: {
    label: "Insight",
    blurb: "So-what on every exhibit, creative ideas that are not generic.",
  },
  synthesis: {
    label: "Synthesis",
    blurb: "Answer first, three reasons, risks, next steps. Under 90 seconds.",
  },
  presence: {
    label: "Presence",
    blurb: "Calm, audible, conversational. Recovers from a stumble.",
  },
};

export interface CaseEntry {
  id: number;
  /** ISO date the case was practiced. */
  practiced_on: string;
  title: string;
  /** The prompt itself, verbatim if you kept it. */
  prompt: string | null;
  /** Where it came from: "Kellogg 2024 casebook", "Victor Cheng", "live with a Bain AC". */
  source: string | null;
  firm: Firm | null;
  style: Style;
  case_type: CaseType;
  industry: string | null;
  /** Who ran it (or who you ran it for). */
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
  /** The single thing to drill before the next one. */
  to_fix: string | null;
  /** Comma-separated weakness tags: "math setup, exhibit so-what". */
  drills: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

/** A case joined with everything derived from its scores. */
export interface ScoredCase extends CaseEntry {
  /** Mean of the recorded dimensions, 1-5. Null when nothing was scored. */
  average: number | null;
  /** The same number out of 10, which is how feedback usually gets said aloud. */
  outOfTen: number | null;
  /** How many of the five dimensions were filled in. */
  scoredCount: number;
  /** Worst recorded dimension, for the one-line takeaway. */
  weakest: Dimension | null;
  drillList: string[];
}

export interface DimensionStat {
  dimension: Dimension;
  average: number | null;
  count: number;
  /** Average over the most recent 5 scored cases, to show movement. */
  recentAverage: number | null;
}

export interface TypeStat {
  case_type: CaseType;
  count: number;
  average: number | null;
  lastPracticed: string | null;
}

export interface NamedStat {
  name: string;
  count: number;
  average: number | null;
}

export interface CaseLogStats {
  totalCases: number;
  taken: number;
  given: number;
  casesLast7: number;
  casesLast30: number;
  totalMinutes: number;
  /** Consecutive days with at least one case, counting back from today. */
  streakDays: number;
  bestStreakDays: number;
  /** All scored cases. */
  average: number | null;
  averageLast5: number | null;
  averagePrev5: number | null;
  best: ScoredCase | null;
  firstPracticed: string | null;
  lastPracticed: string | null;
  byDimension: DimensionStat[];
  byType: TypeStat[];
  /** Types with no reps at all, so the gaps are visible. */
  untouchedTypes: CaseType[];
  byPartner: NamedStat[];
  bySource: NamedStat[];
  byFirm: NamedStat[];
  /** Cases per ISO week, oldest first, last 12 weeks. */
  weekly: { week: string; count: number; average: number | null }[];
  /** Recurring drill tags, most frequent first. */
  topDrills: { tag: string; count: number }[];
  recent: ScoredCase[];
  openFixes: ScoredCase[];
}
