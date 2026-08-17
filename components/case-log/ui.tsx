import Link from "next/link";
import { formatOutOfTen, scoreLabel, scoreTone } from "@/lib/case-log/scoring";
import {
  CASE_TYPE_LABELS,
  DIMENSION_META,
  type CaseType,
  type Dimension,
} from "@/lib/case-log/types";

export function Card({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`bg-white border border-zinc-200 rounded-xl ${className}`}>
      {children}
    </div>
  );
}

export function SectionHeading({
  title,
  hint,
  action,
}: {
  title: string;
  hint?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex items-baseline justify-between gap-4 mb-3">
      <div>
        <h2 className="font-serif text-xl font-bold text-zinc-900">{title}</h2>
        {hint && <p className="text-xs text-zinc-500 mt-0.5">{hint}</p>}
      </div>
      {action}
    </div>
  );
}

const TONE_TEXT = {
  neutral: "text-zinc-900",
  warn: "text-amber-700",
  alert: "text-red-700",
  good: "text-emerald-700",
} as const;

export type Tone = keyof typeof TONE_TEXT;

export function StatCard({
  label,
  value,
  sub,
  tone = "neutral",
  href,
}: {
  label: string;
  value: string | number;
  sub?: string;
  tone?: Tone;
  href?: string;
}) {
  const body = (
    <Card className="p-4 h-full transition-colors hover:border-zinc-300">
      <div className="text-[11px] font-semibold uppercase tracking-widest text-zinc-400">
        {label}
      </div>
      <div className={`font-serif text-3xl font-bold mt-1.5 ${TONE_TEXT[tone]}`}>
        {value}
      </div>
      {sub && (
        <div className="text-xs text-zinc-500 mt-1 leading-snug">{sub}</div>
      )}
    </Card>
  );

  return href ? (
    <Link href={href} className="block h-full">
      {body}
    </Link>
  ) : (
    body
  );
}

/** Horizontal proportion bar, used by every breakdown panel. */
export function Bar({
  value,
  max,
  className = "bg-zinc-900",
}: {
  value: number;
  max: number;
  className?: string;
}) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0;
  return (
    <div className="h-1.5 w-full rounded-full bg-zinc-100 overflow-hidden">
      <div
        className={`h-full rounded-full ${className}`}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

const DOT_FILL = {
  good: "bg-emerald-600",
  warn: "bg-amber-500",
  alert: "bg-red-500",
  neutral: "bg-zinc-300",
} as const;

/**
 * Five dots beat a number for a 1-5 score: the shape is readable at a glance
 * down a long list, and a 2 looks as bad as it felt.
 */
export function ScoreDots({
  value,
  size = "sm",
}: {
  value: number | null;
  size?: "sm" | "md";
}) {
  const tone = scoreTone(value);
  const filled = value === null ? 0 : Math.round(value);
  const dot = size === "md" ? "h-2.5 w-2.5" : "h-2 w-2";

  return (
    <span
      className="inline-flex items-center gap-1"
      title={value === null ? "Not scored" : `${value.toFixed(1)} / 5`}
    >
      {[1, 2, 3, 4, 5].map((i) => (
        <span
          key={i}
          className={`${dot} rounded-full ${
            i <= filled ? DOT_FILL[tone] : "bg-zinc-200"
          }`}
        />
      ))}
    </span>
  );
}

const PILL_TONE = {
  good: "bg-emerald-50 text-emerald-700 border-emerald-200",
  warn: "bg-amber-50 text-amber-700 border-amber-200",
  alert: "bg-red-50 text-red-700 border-red-200",
  neutral: "bg-zinc-100 text-zinc-500 border-zinc-200",
} as const;

/** The headline number, said the way feedback gets said: out of ten. */
export function ScorePill({
  value,
  showLabel = false,
}: {
  value: number | null;
  showLabel?: boolean;
}) {
  const tone = scoreTone(value);
  return (
    <span
      className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-2.5 py-1 text-[11px] font-semibold ${PILL_TONE[tone]}`}
    >
      {value === null ? "Unscored" : `${formatOutOfTen(value)}/10`}
      {showLabel && value !== null && (
        <span className="font-normal opacity-80">{scoreLabel(value)}</span>
      )}
    </span>
  );
}

export function TypeBadge({ type }: { type: CaseType }) {
  return (
    <span className="inline-flex items-center rounded-full border border-zinc-200 bg-zinc-50 px-2 py-0.5 text-[11px] font-medium text-zinc-600 whitespace-nowrap">
      {CASE_TYPE_LABELS[type]}
    </span>
  );
}

export function DimensionLabel({ dimension }: { dimension: Dimension }) {
  return (
    <span title={DIMENSION_META[dimension].blurb}>
      {DIMENSION_META[dimension].label}
    </span>
  );
}

export function EmptyState({
  title,
  body,
  cta,
}: {
  title: string;
  body: string;
  cta?: React.ReactNode;
}) {
  return (
    <Card className="p-10 text-center">
      <h3 className="font-serif text-xl font-bold text-zinc-900">{title}</h3>
      <p className="text-sm text-zinc-500 mt-2 max-w-md mx-auto leading-relaxed">
        {body}
      </p>
      {cta && <div className="mt-5">{cta}</div>}
    </Card>
  );
}

export const buttonClass =
  "inline-flex items-center justify-center rounded-lg bg-zinc-900 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-zinc-700 disabled:opacity-50";

export const ghostButtonClass =
  "inline-flex items-center justify-center rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm font-medium text-zinc-700 transition-colors hover:border-zinc-400 hover:text-zinc-900";

export const labelClass =
  "block text-[11px] font-semibold uppercase tracking-widest text-zinc-500 mb-1.5";

export const inputClass =
  "w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none transition-colors focus:border-zinc-900";

export const selectClass =
  "rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-700 outline-none focus:border-zinc-900";
