import Link from "next/link";
import { quickLogAction } from "@/app/network/actions";
import { cadenceLabel, formatDate, humanGap } from "@/lib/network/cadence";
import type { PersonWithStatus } from "@/lib/network/types";
import { ClosenessBadge, StatusPill } from "./ui";

function lastTouch(p: PersonWithStatus): string {
  if (!p.last_contact) return "Never logged";
  return `${humanGap(p.days_since_contact ?? 0)} · ${formatDate(p.last_contact)}`;
}

export default function PersonRow({ person }: { person: PersonWithStatus }) {
  const meta = [
    person.role && person.company
      ? `${person.role} at ${person.company}`
      : (person.company ?? person.role),
    person.where_met && `met at ${person.where_met}`,
    person.location,
  ].filter(Boolean);

  return (
    <li className="group flex flex-wrap items-center gap-x-4 gap-y-2 border-b border-zinc-100 px-4 py-3.5 last:border-b-0 hover:bg-zinc-50">
      <div className="min-w-0 flex-1 basis-64">
        <Link
          href={`/network/people/${person.id}`}
          className="font-semibold text-zinc-900 hover:underline"
        >
          {person.name}
        </Link>
        {meta.length > 0 && (
          <div className="truncate text-xs text-zinc-500">{meta.join(" · ")}</div>
        )}
      </div>

      <div className="hidden w-32 shrink-0 lg:block">
        <ClosenessBadge value={person.closeness} />
        <div className="mt-0.5 text-[11px] text-zinc-400">
          {cadenceLabel(person.cadence_days)}
        </div>
      </div>

      <div className="w-40 shrink-0 text-xs text-zinc-500">
        {lastTouch(person)}
        {person.awaiting_reply && (
          <div className="text-[11px] text-amber-600">No reply yet</div>
        )}
      </div>

      <div className="shrink-0">
        <StatusPill person={person} />
      </div>

      <form action={quickLogAction} className="shrink-0">
        <input type="hidden" name="person_id" value={person.id} />
        <button
          type="submit"
          title="Log a touch today"
          className="rounded-lg border border-zinc-300 px-2.5 py-1 text-xs font-medium text-zinc-600 transition-colors hover:border-zinc-900 hover:text-zinc-900"
        >
          Spoke today
        </button>
      </form>
    </li>
  );
}
