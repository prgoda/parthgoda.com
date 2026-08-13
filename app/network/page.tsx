import Link from "next/link";
import PersonRow from "@/components/network/PersonRow";
import {
  Bar,
  Card,
  ClosenessBadge,
  EmptyState,
  SectionHeading,
  StatCard,
  buttonClass,
} from "@/components/network/ui";
import {
  GENDER_LABELS,
  closenessLabel,
  formatDate,
  humanGap,
  todayISO,
} from "@/lib/network/cadence";
import { dashboardStats, listPeople } from "@/lib/network/queries";

function monthLabel(key: string): string {
  const [y, m] = key.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, 1)).toLocaleDateString("en-GB", {
    month: "narrow",
    timeZone: "UTC",
  });
}

export default function NetworkDashboard() {
  const stats = dashboardStats();
  const today = todayISO();

  const focus = listPeople({ sort: "urgency" })
    .filter((p) => p.status === "overdue" || p.status === "due-soon")
    .slice(0, 10);

  if (stats.totalPeople === 0 && stats.archivedPeople === 0) {
    return (
      <div className="py-10">
        <EmptyState
          title="Nobody in here yet"
          body="Add the people you never want to lose touch with. Set how close they are and how often you want to reach out, and this page starts keeping score."
          cta={
            <Link href="/network/people/new" className={buttonClass}>
              Add your first person
            </Link>
          }
        />
        <p className="mt-4 text-center text-xs text-zinc-400">
          Have a list already? Run{" "}
          <code className="rounded bg-zinc-100 px-1.5 py-0.5">
            npm run network:import -- people.csv
          </code>
        </p>
      </div>
    );
  }

  const maxMonth = Math.max(1, ...stats.monthly.map((m) => m.count));
  const maxWhereMet = Math.max(1, ...stats.byWhereMet.map((w) => w.count));

  return (
    <div className="space-y-10">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="text-[11px] font-semibold uppercase tracking-widest text-zinc-400">
            {formatDate(today)}
          </div>
          <h1 className="font-serif text-3xl font-bold text-zinc-900 mt-1">
            Your network at a glance
          </h1>
        </div>
        <Link href="/network/people/new" className={buttonClass}>
          Add someone
        </Link>
      </header>

      {/* Headline numbers */}
      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="People tracked"
          value={stats.totalPeople}
          sub={
            stats.archivedPeople > 0
              ? `${stats.archivedPeople} archived`
              : "Everyone you are keeping warm"
          }
          href="/network/people"
        />
        <StatCard
          label="Overdue"
          value={stats.overdue}
          tone={stats.overdue > 0 ? "alert" : "good"}
          sub={stats.overdue > 0 ? "Past their cadence" : "Nothing is slipping"}
          href="/network/people?status=overdue"
        />
        <StatCard
          label="Due in 2 weeks"
          value={stats.dueSoon}
          tone={stats.dueSoon > 0 ? "warn" : "neutral"}
          sub="Coming up on their cadence"
          href="/network/people?status=due-soon"
        />
        <StatCard
          label={`Reached in ${today.slice(0, 4)}`}
          value={stats.peopleReachedThisYear}
          tone="good"
          sub={`${stats.interactionsThisYear} conversations logged`}
        />
      </section>

      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Reply rate"
          value={
            stats.responseRate === null
              ? "n/a"
              : `${Math.round(stats.responseRate * 100)}%`
          }
          sub={`${stats.respondedLast365} of ${stats.outboundLast365} outbound replied, last 12 months`}
        />
        <StatCard
          label="Waiting on a reply"
          value={stats.awaitingReply}
          tone={stats.awaitingReply > 0 ? "warn" : "neutral"}
          sub="Your last message went unanswered"
        />
        <StatCard
          label="Never contacted"
          value={stats.neverContacted}
          sub="In the list but no conversation logged"
          href="/network/people?status=never"
        />
        <StatCard
          label="Typical silence"
          value={
            stats.medianDaysSinceContact === null
              ? "n/a"
              : humanGap(stats.medianDaysSinceContact).replace(" ago", "")
          }
          sub="Median time since the last conversation"
        />
      </section>

      {/* Who to reach out to */}
      <section>
        <SectionHeading
          title="Reach out to these people"
          hint="Overdue first, then whatever is about to come due."
          action={
            <Link
              href="/network/people?status=overdue"
              className="text-xs font-semibold uppercase tracking-widest text-zinc-400 hover:text-zinc-900"
            >
              See all
            </Link>
          }
        />
        {focus.length === 0 ? (
          <Card className="p-8 text-center text-sm text-zinc-500">
            Nobody is due right now. That is the whole point.
          </Card>
        ) : (
          <Card className="overflow-hidden">
            <ul>
              {focus.map((p) => (
                <PersonRow key={p.id} person={p} />
              ))}
            </ul>
          </Card>
        )}
      </section>

      {/* Breakdowns */}
      <section className="grid gap-4 lg:grid-cols-3">
        <Card className="p-5">
          <h3 className="font-serif text-lg font-bold mb-4">By closeness</h3>
          <ul className="space-y-3">
            {stats.byCloseness.map((row) => (
              <li key={row.closeness}>
                <div className="flex items-baseline justify-between gap-2 mb-1">
                  <Link
                    href={`/network/people?closeness=${row.closeness}`}
                    className="hover:underline"
                  >
                    <ClosenessBadge value={row.closeness} />
                  </Link>
                  <span className="text-xs text-zinc-500">
                    {row.count}
                    {row.overdue > 0 && (
                      <span className="text-red-600"> · {row.overdue} overdue</span>
                    )}
                  </span>
                </div>
                <Bar value={row.count} max={Math.max(1, stats.totalPeople)} />
              </li>
            ))}
          </ul>
        </Card>

        <Card className="p-5">
          <h3 className="font-serif text-lg font-bold mb-4">Where you met</h3>
          {stats.byWhereMet.length === 0 ? (
            <p className="text-sm text-zinc-400">
              Fill in &ldquo;where you met&rdquo; and this fills itself in.
            </p>
          ) : (
            <ul className="space-y-3">
              {stats.byWhereMet.map((row) => (
                <li key={row.where_met}>
                  <div className="flex items-baseline justify-between gap-2 mb-1">
                    <Link
                      href={`/network/people?whereMet=${encodeURIComponent(row.where_met)}`}
                      className="truncate text-sm text-zinc-700 hover:underline"
                    >
                      {row.where_met}
                    </Link>
                    <span className="text-xs text-zinc-500">{row.count}</span>
                  </div>
                  <Bar value={row.count} max={maxWhereMet} />
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card className="p-5">
          <h3 className="font-serif text-lg font-bold mb-4">Make-up</h3>
          <ul className="space-y-3">
            {stats.byGender.map((row) => (
              <li key={row.gender}>
                <div className="flex items-baseline justify-between gap-2 mb-1">
                  <span className="text-sm text-zinc-700">
                    {GENDER_LABELS[row.gender] ?? row.gender}
                  </span>
                  <span className="text-xs text-zinc-500">
                    {row.count} ·{" "}
                    {Math.round((row.count / Math.max(1, stats.totalPeople)) * 100)}%
                  </span>
                </div>
                <Bar value={row.count} max={Math.max(1, stats.totalPeople)} />
              </li>
            ))}
          </ul>
          <div className="mt-5 border-t border-zinc-100 pt-4 text-xs text-zinc-500 leading-relaxed">
            {stats.interactionsLast30} conversations in the last 30 days.
          </div>
        </Card>
      </section>

      {/* Activity + silences */}
      <section className="grid gap-4 lg:grid-cols-2">
        <Card className="p-5">
          <h3 className="font-serif text-lg font-bold mb-1">
            Conversations, last 12 months
          </h3>
          <p className="text-xs text-zinc-500 mb-5">
            Every logged touch, inbound and outbound.
          </p>
          <div className="flex h-32 items-end gap-1.5">
            {stats.monthly.map((m) => (
              <div key={m.month} className="flex flex-1 flex-col items-center gap-1.5">
                <div className="text-[10px] font-medium text-zinc-400">
                  {m.count > 0 ? m.count : ""}
                </div>
                <div
                  className="w-full rounded-t bg-zinc-900"
                  style={{ height: `${Math.max(2, (m.count / maxMonth) * 88)}px` }}
                  title={`${m.month}: ${m.count}`}
                />
                <div className="text-[10px] text-zinc-400">{monthLabel(m.month)}</div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-5">
          <h3 className="font-serif text-lg font-bold mb-1">Longest silences</h3>
          <p className="text-xs text-zinc-500 mb-4">
            People you have spoken to before, ordered by how long it has been.
          </p>
          {stats.longestSilences.length === 0 ? (
            <p className="text-sm text-zinc-400">No conversations logged yet.</p>
          ) : (
            <ul className="divide-y divide-zinc-100">
              {stats.longestSilences.map((p) => (
                <li key={p.id} className="flex items-center justify-between gap-3 py-2">
                  <Link
                    href={`/network/people/${p.id}`}
                    className="truncate text-sm font-medium text-zinc-800 hover:underline"
                  >
                    {p.name}
                    <span className="ml-2 text-xs font-normal text-zinc-400">
                      {closenessLabel(p.closeness)}
                    </span>
                  </Link>
                  <span className="shrink-0 text-xs text-zinc-500">
                    {humanGap(p.days_since_contact ?? 0)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </section>
    </div>
  );
}
