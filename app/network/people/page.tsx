import Link from "next/link";
import PersonRow from "@/components/network/PersonRow";
import {
  Card,
  EmptyState,
  buttonClass,
  ghostButtonClass,
} from "@/components/network/ui";
import { CLOSENESS_TIERS } from "@/lib/network/cadence";
import { distinctWhereMet, listPeople } from "@/lib/network/queries";
import type { Closeness, ContactStatus } from "@/lib/network/types";

type Search = {
  q?: string;
  status?: string;
  closeness?: string;
  whereMet?: string;
  tag?: string;
  sort?: string;
  archived?: string;
};

const STATUS_OPTIONS = [
  { value: "all", label: "Everyone" },
  { value: "overdue", label: "Overdue" },
  { value: "due-soon", label: "Due soon" },
  { value: "ok", label: "On track" },
  { value: "snoozed", label: "Snoozed" },
  { value: "never", label: "Never contacted" },
];

const SORT_OPTIONS = [
  { value: "urgency", label: "Most overdue" },
  { value: "name", label: "Name" },
  { value: "recent", label: "Recently spoken" },
  { value: "closeness", label: "Closest first" },
  { value: "added", label: "Recently added" },
];

const selectClass =
  "rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-700 outline-none focus:border-zinc-900";

export default async function PeoplePage({
  searchParams,
}: {
  searchParams: Promise<Search>;
}) {
  const sp = await searchParams;
  const archived = sp.archived === "1";

  const people = await listPeople({
    search: sp.q,
    status: (sp.status as ContactStatus | "all" | "never") ?? "all",
    closeness: sp.closeness ? (Number(sp.closeness) as Closeness) : undefined,
    whereMet: sp.whereMet,
    tag: sp.tag,
    archived,
    sort: (sp.sort as "urgency" | "name" | "recent" | "closeness" | "added") ?? "urgency",
  });

  const places = await distinctWhereMet();
  const overdue = people.filter((p) => p.status === "overdue").length;

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-zinc-900">
            {archived ? "Archived" : "Everyone"}
          </h1>
          <p className="text-sm text-zinc-500 mt-1">
            {people.length} {people.length === 1 ? "person" : "people"}
            {overdue > 0 && (
              <span className="text-red-600"> · {overdue} overdue</span>
            )}
          </p>
        </div>
        <div className="flex gap-2">
          <Link
            href={archived ? "/network/people" : "/network/people?archived=1"}
            className={ghostButtonClass}
          >
            {archived ? "Back to active" : "Archived"}
          </Link>
          <Link href="/network/people/new" className={buttonClass}>
            Add someone
          </Link>
        </div>
      </header>

      {/* Plain GET form: filters live in the URL, so they survive a refresh. */}
      <form
        method="get"
        action="/network/people"
        className="flex flex-wrap items-center gap-2"
      >
        {archived && <input type="hidden" name="archived" value="1" />}
        <input
          type="search"
          name="q"
          defaultValue={sp.q ?? ""}
          placeholder="Search name, company, notes, where you met..."
          className="min-w-56 flex-1 rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm outline-none focus:border-zinc-900"
        />
        <select name="status" defaultValue={sp.status ?? "all"} className={selectClass}>
          {STATUS_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <select name="closeness" defaultValue={sp.closeness ?? ""} className={selectClass}>
          <option value="">Any closeness</option>
          {CLOSENESS_TIERS.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </select>
        <select name="whereMet" defaultValue={sp.whereMet ?? ""} className={selectClass}>
          <option value="">Anywhere met</option>
          {places.map((p) => (
            <option key={p.value} value={p.value}>
              {p.value} ({p.count})
            </option>
          ))}
        </select>
        <select name="sort" defaultValue={sp.sort ?? "urgency"} className={selectClass}>
          {SORT_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <button type="submit" className={ghostButtonClass}>
          Apply
        </button>
        <Link
          href={archived ? "/network/people?archived=1" : "/network/people"}
          className="px-2 text-xs text-zinc-400 hover:text-zinc-700"
        >
          Reset
        </Link>
      </form>

      {people.length === 0 ? (
        <EmptyState
          title="No matches"
          body={
            archived
              ? "Nothing archived yet. Archiving keeps someone in the database without nagging you about them."
              : "Nobody fits those filters. Try widening the search or resetting."
          }
          cta={
            <Link href="/network/people" className={ghostButtonClass}>
              Clear filters
            </Link>
          }
        />
      ) : (
        <Card className="overflow-hidden">
          <ul>
            {people.map((p) => (
              <PersonRow key={p.id} person={p} />
            ))}
          </ul>
        </Card>
      )}
    </div>
  );
}
