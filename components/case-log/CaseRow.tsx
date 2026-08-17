import Link from "next/link";
import { DIMENSION_META, FIRM_LABELS } from "@/lib/case-log/types";
import type { ScoredCase } from "@/lib/case-log/types";
import { formatDate } from "@/lib/dates";
import { ScoreDots, ScorePill, TypeBadge } from "./ui";

/** One line in every list of cases. Dense on purpose: scannable down a page. */
export default function CaseRow({ entry }: { entry: ScoredCase }) {
  const meta = [
    entry.industry,
    entry.firm ? FIRM_LABELS[entry.firm] : null,
    entry.partner,
    entry.source,
  ].filter(Boolean);

  return (
    <li className="border-b border-zinc-100 last:border-b-0">
      <Link
        href={`/case-log/cases/${entry.id}`}
        className="flex flex-wrap items-center gap-x-4 gap-y-2 px-4 py-3 transition-colors hover:bg-zinc-50"
      >
        <div className="w-20 shrink-0 text-xs text-zinc-400">
          {formatDate(entry.practiced_on).replace(/ \d{4}$/, "")}
        </div>

        <div className="min-w-52 flex-1">
          <div className="flex items-center gap-2">
            <span className="truncate text-sm font-semibold text-zinc-900">
              {entry.title}
            </span>
            {entry.role === "interviewer" && (
              <span className="shrink-0 rounded bg-zinc-100 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-zinc-500">
                Gave
              </span>
            )}
          </div>
          {meta.length > 0 && (
            <div className="truncate text-xs text-zinc-500">
              {meta.join(" · ")}
            </div>
          )}
        </div>

        <TypeBadge type={entry.case_type} />

        <div className="flex items-center gap-3">
          <ScoreDots value={entry.average} />
          <ScorePill value={entry.average} />
        </div>

        {entry.weakest && (
          <div className="w-32 shrink-0 text-right text-xs text-zinc-400">
            weakest: {DIMENSION_META[entry.weakest].label.toLowerCase()}
          </div>
        )}
      </Link>
    </li>
  );
}
