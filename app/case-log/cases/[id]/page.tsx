import Link from "next/link";
import { notFound } from "next/navigation";
import { deleteCaseAction } from "@/app/case-log/actions";
import {
  Bar,
  Card,
  ScoreDots,
  ScorePill,
  TypeBadge,
  ghostButtonClass,
} from "@/components/case-log/ui";
import {
  formatAverage,
  formatMinutes,
  scoreLabel,
  scoreTone,
} from "@/lib/case-log/scoring";
import { getCase, previousCase } from "@/lib/case-log/queries";
import { canWrite } from "@/lib/case-log/session";
import {
  DIMENSIONS,
  DIMENSION_META,
  FIRM_LABELS,
  FORMAT_LABELS,
  ROLE_LABELS,
  STYLE_LABELS,
} from "@/lib/case-log/types";
import { formatDate } from "@/lib/dates";

const BAR_TONE = {
  good: "bg-emerald-600",
  warn: "bg-amber-500",
  alert: "bg-red-500",
  neutral: "bg-zinc-300",
} as const;

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-[11px] font-semibold uppercase tracking-widest text-zinc-400">
        {label}
      </div>
      <div className="text-sm text-zinc-800 mt-0.5">{value}</div>
    </div>
  );
}

function Prose({
  title,
  body,
  className = "",
}: {
  title: string;
  body: string;
  className?: string;
}) {
  return (
    <Card className={`p-5 ${className}`}>
      <h3 className="font-serif text-lg font-bold mb-2">{title}</h3>
      <p className="text-sm text-zinc-700 leading-relaxed whitespace-pre-wrap">
        {body}
      </p>
    </Card>
  );
}

export default async function CaseDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const numericId = Number(id);
  if (!Number.isInteger(numericId)) notFound();

  const entry = await getCase(numericId);
  if (!entry) notFound();

  const previous = await previousCase(entry);
  const writable = await canWrite();

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <Link
          href="/case-log/cases"
          className="text-xs font-semibold uppercase tracking-widest text-zinc-400 hover:text-zinc-900"
        >
          ← All cases
        </Link>
      </div>

      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <TypeBadge type={entry.case_type} />
            <span className="text-xs text-zinc-400">
              {formatDate(entry.practiced_on)}
            </span>
            {entry.role === "interviewer" && (
              <span className="rounded bg-zinc-100 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-zinc-500">
                You gave it
              </span>
            )}
          </div>
          <h1 className="font-serif text-3xl font-bold text-zinc-900 mt-2">
            {entry.title}
          </h1>
        </div>
        {writable && (
          <div className="flex items-center gap-2">
            <Link
              href={`/case-log/cases/${entry.id}/edit`}
              className={ghostButtonClass}
            >
              Edit
            </Link>
            <form action={deleteCaseAction}>
              <input type="hidden" name="id" value={entry.id} />
              <button
                type="submit"
                className="inline-flex items-center justify-center rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm font-medium text-red-600 transition-colors hover:border-red-300 hover:bg-red-50"
              >
                Delete
              </button>
            </form>
          </div>
        )}
      </header>

      <Card className="p-5">
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          <Meta label="Role" value={ROLE_LABELS[entry.role]} />
          <Meta label="Format" value={FORMAT_LABELS[entry.format]} />
          <Meta
            label="Length"
            value={entry.minutes ? formatMinutes(entry.minutes) : "Not recorded"}
          />
          <Meta
            label={entry.role === "interviewee" ? "Given by" : "Given to"}
            value={entry.partner ?? "Not recorded"}
          />
          <Meta
            label="Firm style"
            value={entry.firm ? FIRM_LABELS[entry.firm] : "Not specific"}
          />
          <Meta label="Who drove" value={STYLE_LABELS[entry.style]} />
          <Meta label="Industry" value={entry.industry ?? "Not recorded"} />
          <Meta label="Source" value={entry.source ?? "Not recorded"} />
        </div>
      </Card>

      {entry.scoredCount > 0 ? (
        <Card className="p-5">
          <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
            <div>
              <h3 className="font-serif text-lg font-bold">Score</h3>
              <p className="text-xs text-zinc-500 mt-0.5">
                {entry.scoredCount} of 5 dimensions scored
                {entry.weakest && (
                  <>
                    {" "}
                    · weakest was{" "}
                    {DIMENSION_META[entry.weakest].label.toLowerCase()}
                  </>
                )}
              </p>
            </div>
            <div className="text-right">
              <div
                className={`font-serif text-3xl font-bold ${
                  scoreTone(entry.average) === "good"
                    ? "text-emerald-700"
                    : scoreTone(entry.average) === "warn"
                      ? "text-amber-700"
                      : "text-red-700"
                }`}
              >
                {entry.outOfTen}/10
              </div>
              <div className="text-xs text-zinc-500">
                {scoreLabel(entry.average)}
              </div>
            </div>
          </div>

          <ul className="space-y-3.5">
            {DIMENSIONS.map((d) => {
              const value = entry[d];
              return (
                <li key={d}>
                  <div className="flex flex-wrap items-baseline justify-between gap-2 mb-1.5">
                    <div>
                      <span className="text-sm font-semibold text-zinc-800">
                        {DIMENSION_META[d].label}
                      </span>
                      <span className="ml-2 text-xs text-zinc-500">
                        {DIMENSION_META[d].blurb}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <ScoreDots value={value} />
                      <span className="w-28 text-right text-xs text-zinc-500">
                        {value === null ? "Not scored" : scoreLabel(value)}
                      </span>
                    </div>
                  </div>
                  <Bar
                    value={value ?? 0}
                    max={5}
                    className={BAR_TONE[scoreTone(value)]}
                  />
                </li>
              );
            })}
          </ul>
        </Card>
      ) : (
        <Card className="p-5 text-sm text-zinc-500">
          {entry.role === "interviewer"
            ? "Given, not taken, so there is nothing to self-score."
            : "This rep was not scored."}{" "}
          {writable && (
            <Link
              href={`/case-log/cases/${entry.id}/edit`}
              className="text-zinc-900 underline"
            >
              {entry.role === "interviewer" ? "Edit the case" : "Score it now"}
            </Link>
          )}
        </Card>
      )}

      {previous?.to_fix && (
        <Card className="border-amber-200 bg-amber-50 p-5">
          <div className="text-[11px] font-semibold uppercase tracking-widest text-amber-700">
            Going into this one, you had said
          </div>
          <p className="mt-1.5 text-sm text-amber-900 leading-relaxed">
            {previous.to_fix}
          </p>
          <Link
            href={`/case-log/cases/${previous.id}`}
            className="mt-2 inline-block text-xs text-amber-700 hover:underline"
          >
            after {previous.title}, {formatDate(previous.practiced_on)}
          </Link>
        </Card>
      )}

      {entry.prompt && <Prose title="The prompt" body={entry.prompt} />}

      <div className="grid gap-4 md:grid-cols-2">
        {entry.went_well && (
          <Prose
            title="What worked"
            body={entry.went_well}
            className="border-emerald-200 bg-emerald-50"
          />
        )}
        {entry.to_fix && (
          <Prose
            title="Fix next time"
            body={entry.to_fix}
            className="border-red-200 bg-red-50"
          />
        )}
      </div>

      {entry.drillList.length > 0 && (
        <Card className="p-5">
          <h3 className="font-serif text-lg font-bold mb-3">Drills</h3>
          <div className="flex flex-wrap gap-1.5">
            {entry.drillList.map((tag) => (
              <Link
                key={tag}
                href={`/case-log/cases?drill=${encodeURIComponent(tag)}`}
                className="rounded-full border border-zinc-200 bg-zinc-50 px-2.5 py-1 text-xs text-zinc-600 transition-colors hover:border-zinc-400"
              >
                {tag}
              </Link>
            ))}
          </div>
        </Card>
      )}

      {entry.notes && <Prose title="Notes" body={entry.notes} />}

      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 text-xs text-zinc-400">
        <span>
          Logged {formatDate(entry.created_at.slice(0, 10))}
          {entry.updated_at.slice(0, 10) !== entry.created_at.slice(0, 10) && (
            <> · edited {formatDate(entry.updated_at.slice(0, 10))}</>
          )}
        </span>
        <div className="flex items-center gap-3">
          <ScorePill value={entry.average} showLabel />
          <span>average {formatAverage(entry.average)} / 5</span>
        </div>
      </div>
    </div>
  );
}
