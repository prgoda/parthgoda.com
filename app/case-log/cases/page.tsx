import Link from "next/link";
import CaseRow from "@/components/case-log/CaseRow";
import {
  Card,
  EmptyState,
  buttonClass,
  selectClass,
} from "@/components/case-log/ui";
import { formatMinutes, formatOutOfTen, mean } from "@/lib/case-log/scoring";
import {
  distinctPartners,
  distinctSources,
  listCases,
} from "@/lib/case-log/queries";
import { canWrite } from "@/lib/case-log/session";
import {
  CASE_TYPES,
  CASE_TYPE_LABELS,
  FIRMS,
  FIRM_LABELS,
  FORMATS,
  FORMAT_LABELS,
  ROLES,
  ROLE_LABELS,
  type CaseType,
  type Firm,
  type Format,
  type Role,
} from "@/lib/case-log/types";

type Search = {
  q?: string;
  type?: string;
  firm?: string;
  partner?: string;
  role?: string;
  format?: string;
  drill?: string;
  weak?: string;
  sort?: string;
};

const SORT_OPTIONS = [
  { value: "recent", label: "Newest first" },
  { value: "oldest", label: "Oldest first" },
  { value: "worst", label: "Worst scored" },
  { value: "best", label: "Best scored" },
  { value: "type", label: "By case type" },
];

/** Below a 3.0 average is the "go back and redo this" pile. */
const WEAK_CUTOFF = 3;

function isMember<T extends string>(
  value: string | undefined,
  allowed: readonly T[],
): T | undefined {
  return value && (allowed as readonly string[]).includes(value)
    ? (value as T)
    : undefined;
}

export default async function CasesPage({
  searchParams,
}: {
  searchParams: Promise<Search>;
}) {
  const sp = await searchParams;
  const weakOnly = sp.weak === "1";

  const cases = await listCases({
    search: sp.q,
    caseType: isMember<CaseType>(sp.type, CASE_TYPES),
    firm: isMember<Firm>(sp.firm, FIRMS),
    role: isMember<Role>(sp.role, ROLES),
    format: isMember<Format>(sp.format, FORMATS),
    partner: sp.partner,
    drill: sp.drill,
    maxAverage: weakOnly ? WEAK_CUTOFF : undefined,
    sort:
      (sp.sort as "recent" | "oldest" | "best" | "worst" | "type") ?? "recent",
  });

  const [partners, sources, writable] = await Promise.all([
    distinctPartners(),
    distinctSources(),
    canWrite(),
  ]);

  const average = mean(
    cases.filter((c) => c.average !== null).map((c) => c.average as number),
  );
  const minutes = cases.reduce((sum, c) => sum + (c.minutes ?? 0), 0);
  const filtered =
    Boolean(sp.q || sp.type || sp.firm || sp.partner || sp.role || sp.format || sp.drill) ||
    weakOnly;

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-zinc-900">
            {weakOnly ? "The redo pile" : "Every case"}
          </h1>
          <p className="text-sm text-zinc-500 mt-1">
            {cases.length} case{cases.length === 1 ? "" : "s"}
            {average !== null && <> · averaging {formatOutOfTen(average)}/10</>}
            {minutes > 0 && <> · {formatMinutes(minutes)} of practice</>}
          </p>
        </div>
        <div className="flex gap-2">
          <Link
            href={weakOnly ? "/case-log/cases" : "/case-log/cases?weak=1&sort=worst"}
            className={
              weakOnly
                ? "inline-flex items-center justify-center rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm font-medium text-zinc-700 transition-colors hover:border-zinc-400"
                : "inline-flex items-center justify-center rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-700 transition-colors hover:border-red-300"
            }
          >
            {weakOnly ? "Show everything" : "Show weak reps"}
          </Link>
          {writable && (
            <Link href="/case-log/cases/new" className={buttonClass}>
              Log a case
            </Link>
          )}
        </div>
      </header>

      {/* Plain GET form: filters live in the URL, so they survive a refresh. */}
      <form
        method="get"
        action="/case-log/cases"
        className="flex flex-wrap items-center gap-2"
      >
        {weakOnly && <input type="hidden" name="weak" value="1" />}
        <input
          type="search"
          name="q"
          defaultValue={sp.q ?? ""}
          placeholder="Search titles, prompts, feedback, notes..."
          className="min-w-56 flex-1 rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm outline-none focus:border-zinc-900"
        />
        <select name="type" defaultValue={sp.type ?? ""} className={selectClass}>
          <option value="">Any type</option>
          {CASE_TYPES.map((t) => (
            <option key={t} value={t}>
              {CASE_TYPE_LABELS[t]}
            </option>
          ))}
        </select>
        <select name="firm" defaultValue={sp.firm ?? ""} className={selectClass}>
          <option value="">Any firm</option>
          {FIRMS.map((f) => (
            <option key={f} value={f}>
              {FIRM_LABELS[f]}
            </option>
          ))}
        </select>
        <select
          name="partner"
          defaultValue={sp.partner ?? ""}
          className={selectClass}
        >
          <option value="">Anyone</option>
          {partners.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>
        <select name="role" defaultValue={sp.role ?? ""} className={selectClass}>
          <option value="">Took or gave</option>
          {ROLES.map((r) => (
            <option key={r} value={r}>
              {ROLE_LABELS[r]}
            </option>
          ))}
        </select>
        <select
          name="format"
          defaultValue={sp.format ?? ""}
          className={selectClass}
        >
          <option value="">Any format</option>
          {FORMATS.map((f) => (
            <option key={f} value={f}>
              {FORMAT_LABELS[f]}
            </option>
          ))}
        </select>
        <select name="sort" defaultValue={sp.sort ?? "recent"} className={selectClass}>
          {SORT_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <button type="submit" className={buttonClass}>
          Filter
        </button>
        {filtered && (
          <Link
            href="/case-log/cases"
            className="text-xs text-zinc-400 hover:text-zinc-700"
          >
            Clear
          </Link>
        )}
      </form>

      {sp.drill && (
        <p className="text-sm text-zinc-600">
          Tagged{" "}
          <span className="font-semibold">{sp.drill}</span>.{" "}
          <Link href="/case-log/cases" className="text-zinc-400 hover:underline">
            Clear
          </Link>
        </p>
      )}

      {cases.length === 0 ? (
        <EmptyState
          title={filtered ? "Nothing matches" : "No cases yet"}
          body={
            filtered
              ? "Loosen a filter, or clear them all and start from the top."
              : "Log the next case you practice and this list starts filling in."
          }
          cta={
            (filtered || writable) && (
              <Link
                href={filtered ? "/case-log/cases" : "/case-log/cases/new"}
                className={buttonClass}
              >
                {filtered ? "Clear filters" : "Log a case"}
              </Link>
            )
          }
        />
      ) : (
        <Card className="overflow-hidden">
          <ul>
            {cases.map((c) => (
              <CaseRow key={c.id} entry={c} />
            ))}
          </ul>
        </Card>
      )}

      {sources.length > 0 && !filtered && (
        <div className="pt-2">
          <div className="text-[11px] font-semibold uppercase tracking-widest text-zinc-400 mb-2">
            Sources you have drawn from
          </div>
          <div className="flex flex-wrap gap-1.5">
            {sources.map((s) => (
              <Link
                key={s}
                href={`/case-log/cases?q=${encodeURIComponent(s)}`}
                className="rounded-full border border-zinc-200 bg-white px-2.5 py-1 text-xs text-zinc-600 transition-colors hover:border-zinc-400"
              >
                {s}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
