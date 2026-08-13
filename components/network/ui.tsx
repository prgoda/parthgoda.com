import Link from "next/link";
import { closenessLabel, humanGap } from "@/lib/network/cadence";
import type { Closeness, PersonWithStatus } from "@/lib/network/types";

export function Card({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`bg-white border border-zinc-200 rounded-xl ${className}`}
    >
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
  tone?: "neutral" | "warn" | "alert" | "good";
  href?: string;
}) {
  const toneClass = {
    neutral: "text-zinc-900",
    warn: "text-amber-700",
    alert: "text-red-700",
    good: "text-emerald-700",
  }[tone];

  const body = (
    <Card className="p-4 h-full transition-colors hover:border-zinc-300">
      <div className="text-[11px] font-semibold uppercase tracking-widest text-zinc-400">
        {label}
      </div>
      <div className={`font-serif text-3xl font-bold mt-1.5 ${toneClass}`}>
        {value}
      </div>
      {sub && <div className="text-xs text-zinc-500 mt-1 leading-snug">{sub}</div>}
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

const STATUS_STYLES: Record<string, { label: string; className: string }> = {
  overdue: { label: "Overdue", className: "bg-red-50 text-red-700 border-red-200" },
  "due-soon": { label: "Due soon", className: "bg-amber-50 text-amber-700 border-amber-200" },
  ok: { label: "On track", className: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  snoozed: { label: "Snoozed", className: "bg-zinc-100 text-zinc-500 border-zinc-200" },
};

export function StatusPill({ person }: { person: PersonWithStatus }) {
  const s = STATUS_STYLES[person.status] ?? STATUS_STYLES.ok;
  const detail =
    person.status === "overdue"
      ? person.days_overdue === 0
        ? "today"
        : `${humanGap(person.days_overdue).replace(" ago", "")} late`
      : person.status === "due-soon"
        ? humanGap(person.days_overdue)
        : null;

  return (
    <span
      className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-2.5 py-1 text-[11px] font-semibold ${s.className}`}
    >
      {s.label}
      {detail && <span className="font-normal opacity-80">{detail}</span>}
    </span>
  );
}

const CLOSENESS_DOTS: Record<Closeness, string> = {
  1: "bg-zinc-900",
  2: "bg-zinc-700",
  3: "bg-zinc-500",
  4: "bg-zinc-400",
  5: "bg-zinc-300",
};

export function ClosenessBadge({ value }: { value: Closeness }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-xs text-zinc-600 whitespace-nowrap">
      <span className={`h-2 w-2 rounded-full ${CLOSENESS_DOTS[value]}`} />
      {closenessLabel(value)}
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

/** Horizontal proportion bar used by the breakdown panels. */
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
      <div className={`h-full rounded-full ${className}`} style={{ width: `${pct}%` }} />
    </div>
  );
}

export const buttonClass =
  "inline-flex items-center justify-center rounded-lg bg-zinc-900 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-zinc-700 disabled:opacity-50";

export const ghostButtonClass =
  "inline-flex items-center justify-center rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm font-medium text-zinc-700 transition-colors hover:border-zinc-400 hover:text-zinc-900";
