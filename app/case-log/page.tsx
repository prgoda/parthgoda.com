import { headers } from "next/headers";
import Link from "next/link";
import CaseRow from "@/components/case-log/CaseRow";
import FeedbackLink from "@/components/case-log/FeedbackLink";
import {
  Bar,
  Card,
  EmptyState,
  ScoreDots,
  ScorePill,
  SectionHeading,
  StatCard,
  buttonClass,
  ghostButtonClass,
} from "@/components/case-log/ui";
import {
  formatAverage,
  formatMinutes,
  formatOutOfTen,
  scoreTone,
} from "@/lib/case-log/scoring";
import { feedbackPath } from "@/lib/case-log/feedback";
import { caseLogStats } from "@/lib/case-log/queries";
import { canWrite } from "@/lib/case-log/session";
import {
  CASE_TYPE_LABELS,
  DIMENSION_META,
  type DimensionStat,
} from "@/lib/case-log/types";
import { formatDate, humanGap, daysBetween, todayISO } from "@/lib/dates";

const BAR_TONE = {
  good: "bg-emerald-600",
  warn: "bg-amber-500",
  alert: "bg-red-500",
  neutral: "bg-zinc-300",
} as const;

function weekLabel(week: string): string {
  const [, m, d] = week.split("-");
  return `${Number(d)}/${Number(m)}`;
}

/** "up 0.6" / "down 0.3" / "flat", comparing the last five reps to the five before. */
function trendCopy(last: number | null, prev: number | null) {
  if (last === null) return { text: "No scored cases yet", tone: "neutral" as const };
  if (prev === null) return { text: "First five reps", tone: "neutral" as const };
  const delta = (last - prev) * 2; // spoken out of ten
  if (Math.abs(delta) < 0.25) return { text: "Flat vs the five before", tone: "neutral" as const };
  return delta > 0
    ? { text: `Up ${delta.toFixed(1)} vs the five before`, tone: "good" as const }
    : { text: `Down ${Math.abs(delta).toFixed(1)} vs the five before`, tone: "alert" as const };
}

/** Absolute URL, because the point of the feedback link is to be pasted elsewhere. */
async function feedbackUrl(): Promise<string> {
  const host = (await headers()).get("host") ?? "parthgoda.com";
  const protocol = host.startsWith("localhost") ? "http" : "https";
  return `${protocol}://${host}${await feedbackPath()}`;
}

export default async function CaseLogDashboard() {
  const stats = await caseLogStats();
  const writable = await canWrite();
  const today = todayISO();
  const casersLink = writable ? await feedbackUrl() : null;

  if (stats.totalCases === 0) {
    return (
      <div className="space-y-6 py-10">
        <EmptyState
          title="No cases logged yet"
          body="Log every case you take and every case you give. Score the five things partners actually grade, write down the one thing to fix, and this page starts telling you where you are losing points."
          cta={
            <Link
              href={writable ? "/case-log/cases/new" : "/case-log/unlock"}
              className={buttonClass}
            >
              {writable ? "Log your first case" : "Unlock to log a case"}
            </Link>
          }
        />
        {casersLink && <FeedbackLink url={casersLink} />}
      </div>
    );
  }

  const scoredDims = stats.byDimension.filter((d) => d.count > 0);
  const ranked = [...scoredDims].sort(
    (a, b) => (a.average as number) - (b.average as number),
  );
  const weakest: DimensionStat | undefined = ranked[0];
  const strongest: DimensionStat | undefined = ranked[ranked.length - 1];

  const trend = trendCopy(stats.averageLast5, stats.averagePrev5);
  const maxWeek = Math.max(1, ...stats.weekly.map((w) => w.count));
  const maxType = Math.max(1, ...stats.byType.map((t) => t.count));
  const maxDrill = Math.max(1, ...stats.topDrills.map((d) => d.count));
  const daysSinceLast =
    stats.lastPracticed === null
      ? null
      : daysBetween(stats.lastPracticed, today);

  return (
    <div className="space-y-10">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="text-[11px] font-semibold uppercase tracking-widest text-zinc-400">
            {formatDate(today)}
          </div>
          <h1 className="font-serif text-3xl font-bold text-zinc-900 mt-1">
            {stats.totalCases} cases in
          </h1>
          <p className="text-sm text-zinc-500 mt-1">
            {stats.firstPracticed && (
              <>Started {formatDate(stats.firstPracticed)}. </>
            )}
            {daysSinceLast === null
              ? null
              : daysSinceLast === 0
                ? "Last one today."
                : `Last one ${humanGap(daysSinceLast)}.`}
          </p>
        </div>
        {writable && (
          <Link href="/case-log/cases/new" className={buttonClass}>
            Log a case
          </Link>
        )}
      </header>

      {casersLink && <FeedbackLink url={casersLink} />}

      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Running average"
          value={stats.average === null ? "—" : `${formatOutOfTen(stats.average)}/10`}
          tone={scoreTone(stats.average)}
          sub={`Across ${stats.taken} case${stats.taken === 1 ? "" : "s"} you took`}
          href="/case-log/cases?sort=worst"
        />
        <StatCard
          label="Last 5 cases"
          value={
            stats.averageLast5 === null
              ? "—"
              : `${formatOutOfTen(stats.averageLast5)}/10`
          }
          tone={trend.tone === "neutral" ? scoreTone(stats.averageLast5) : trend.tone}
          sub={trend.text}
        />
        <StatCard
          label="This week"
          value={stats.casesLast7}
          tone={stats.casesLast7 === 0 ? "alert" : "good"}
          sub={`${stats.casesLast30} in the last 30 days`}
        />
        <StatCard
          label="Streak"
          value={stats.streakDays === 0 ? "—" : `${stats.streakDays}d`}
          tone={stats.streakDays >= 3 ? "good" : "neutral"}
          sub={
            stats.bestStreakDays > 0
              ? `Best run: ${stats.bestStreakDays} day${stats.bestStreakDays === 1 ? "" : "s"}`
              : "Consecutive days practiced"
          }
        />
      </section>

      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Time in the chair"
          value={formatMinutes(stats.totalMinutes)}
          sub="Across every logged rep"
        />
        <StatCard
          label="Cases given"
          value={stats.given}
          sub="Interviewing others is the cheapest way to learn"
          href="/case-log/cases?role=interviewer"
        />
        <StatCard
          label="Partners"
          value={stats.byPartner.length}
          sub="Distinct people you have cased with"
        />
        <StatCard
          label="Types covered"
          value={`${stats.byType.length}/${stats.byType.length + stats.untouchedTypes.length}`}
          tone={stats.untouchedTypes.length > 4 ? "warn" : "good"}
          sub={
            stats.untouchedTypes.length === 0
              ? "Every case type touched"
              : `${stats.untouchedTypes.length} never attempted`
          }
        />
      </section>

      {/* The whole reason for scoring five things separately. */}
      <section>
        <SectionHeading
          title="Where the points are going"
          hint="Average per dimension, worst first. The recent column is the last five times each one was scored."
        />
        <Card className="p-5">
          {scoredDims.length === 0 ? (
            <p className="text-sm text-zinc-400">
              Nothing scored yet. Score a case and this becomes the most useful
              panel on the page.
            </p>
          ) : (
            <>
              <ul className="space-y-4">
                {ranked.map((row) => {
                  const tone = scoreTone(row.average);
                  const moved =
                    row.recentAverage !== null && row.average !== null
                      ? row.recentAverage - row.average
                      : 0;
                  return (
                    <li key={row.dimension}>
                      <div className="flex flex-wrap items-baseline justify-between gap-2 mb-1.5">
                        <div>
                          <span className="text-sm font-semibold text-zinc-800">
                            {DIMENSION_META[row.dimension].label}
                          </span>
                          <span className="ml-2 text-xs text-zinc-500">
                            {DIMENSION_META[row.dimension].blurb}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-zinc-500">
                          <span>
                            last 5:{" "}
                            <span className="font-semibold text-zinc-700">
                              {formatAverage(row.recentAverage)}
                            </span>
                            {Math.abs(moved) >= 0.25 && (
                              <span
                                className={
                                  moved > 0 ? "text-emerald-600" : "text-red-600"
                                }
                              >
                                {" "}
                                {moved > 0 ? "↑" : "↓"}
                              </span>
                            )}
                          </span>
                          <ScoreDots value={row.average} size="md" />
                          <span className="w-14 text-right font-semibold text-zinc-700">
                            {formatAverage(row.average)} / 5
                          </span>
                        </div>
                      </div>
                      <Bar
                        value={row.average ?? 0}
                        max={5}
                        className={BAR_TONE[tone]}
                      />
                    </li>
                  );
                })}
              </ul>

              {weakest && strongest && weakest !== strongest && (
                <p className="mt-5 border-t border-zinc-100 pt-4 text-sm text-zinc-600 leading-relaxed">
                  <span className="font-semibold">
                    {DIMENSION_META[weakest.dimension].label.toLowerCase()}
                  </span>{" "}
                  is costing you the most, sitting{" "}
                  {(
                    ((strongest.average as number) -
                      (weakest.average as number)) *
                    2
                  ).toFixed(1)}{" "}
                  points below{" "}
                  {DIMENSION_META[strongest.dimension].label.toLowerCase()}. That
                  is the drill for this week.
                </p>
              )}
            </>
          )}
        </Card>
      </section>

      {/* What you said you'd fix, read back to you. */}
      {stats.openFixes.length > 0 && (
        <section>
          <SectionHeading
            title="What you said you would fix"
            hint="Pulled from the last few cases, newest first."
          />
          <Card className="divide-y divide-zinc-100">
            {stats.openFixes.map((c) => (
              <div key={c.id} className="p-4">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <Link
                    href={`/case-log/cases/${c.id}`}
                    className="text-sm font-semibold text-zinc-900 hover:underline"
                  >
                    {c.title}
                  </Link>
                  <span className="text-xs text-zinc-400">
                    {formatDate(c.practiced_on)}
                  </span>
                </div>
                <p className="mt-1 text-sm text-zinc-600 leading-relaxed">
                  {c.to_fix}
                </p>
              </div>
            ))}
          </Card>
        </section>
      )}

      <section className="grid gap-4 lg:grid-cols-2">
        <Card className="p-5">
          <h3 className="font-serif text-lg font-bold mb-1">
            Reps per week, last 12
          </h3>
          <p className="text-xs text-zinc-500 mb-5">
            Cases taken and given. Consistency beats cramming.
          </p>
          <div className="flex h-32 items-end gap-1.5">
            {stats.weekly.map((w) => (
              <div
                key={w.week}
                className="flex flex-1 flex-col items-center gap-1.5"
              >
                <div className="text-[10px] font-medium text-zinc-400">
                  {w.count > 0 ? w.count : ""}
                </div>
                <div
                  className="w-full rounded-t bg-zinc-900"
                  style={{
                    height: `${Math.max(2, (w.count / maxWeek) * 88)}px`,
                  }}
                  title={`Week of ${formatDate(w.week)}: ${w.count} case${
                    w.count === 1 ? "" : "s"
                  }${w.average !== null ? `, avg ${formatOutOfTen(w.average)}/10` : ""}`}
                />
                <div className="text-[10px] text-zinc-400">
                  {weekLabel(w.week)}
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-5">
          <h3 className="font-serif text-lg font-bold mb-1">
            What keeps coming up
          </h3>
          <p className="text-xs text-zinc-500 mb-4">
            Your drill tags, by how often you have written them down.
          </p>
          {stats.topDrills.length === 0 ? (
            <p className="text-sm text-zinc-400">
              Tag a few cases and the pattern shows up here.
            </p>
          ) : (
            <ul className="space-y-3">
              {stats.topDrills.map((d) => (
                <li key={d.tag}>
                  <div className="flex items-baseline justify-between gap-2 mb-1">
                    <Link
                      href={`/case-log/cases?drill=${encodeURIComponent(d.tag)}`}
                      className="truncate text-sm text-zinc-700 hover:underline"
                    >
                      {d.tag}
                    </Link>
                    <span className="text-xs text-zinc-500">{d.count}×</span>
                  </div>
                  <Bar value={d.count} max={maxDrill} />
                </li>
              ))}
            </ul>
          )}
        </Card>
      </section>

      <section>
        <SectionHeading
          title="By case type"
          hint="Volume and average. A thin bar with a low score is the next thing to drill."
        />
        <Card className="overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-100 text-left text-[11px] font-semibold uppercase tracking-widest text-zinc-400">
                <th className="px-4 py-2.5">Type</th>
                <th className="px-4 py-2.5 w-40">Reps</th>
                <th className="px-4 py-2.5 w-32">Average</th>
                <th className="px-4 py-2.5 w-32 text-right">Last done</th>
              </tr>
            </thead>
            <tbody>
              {stats.byType.map((t) => (
                <tr
                  key={t.case_type}
                  className="border-b border-zinc-50 last:border-b-0"
                >
                  <td className="px-4 py-2.5">
                    <Link
                      href={`/case-log/cases?type=${t.case_type}`}
                      className="font-medium text-zinc-800 hover:underline"
                    >
                      {CASE_TYPE_LABELS[t.case_type]}
                    </Link>
                  </td>
                  <td className="px-4 py-2.5">
                    <div className="flex items-center gap-2">
                      <span className="w-5 text-xs text-zinc-500">
                        {t.count}
                      </span>
                      <Bar value={t.count} max={maxType} />
                    </div>
                  </td>
                  <td className="px-4 py-2.5">
                    <ScorePill value={t.average} />
                  </td>
                  <td className="px-4 py-2.5 text-right text-xs text-zinc-400">
                    {t.lastPracticed ? formatDate(t.lastPracticed) : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {stats.untouchedTypes.length > 0 && (
            <div className="border-t border-zinc-100 bg-zinc-50 px-4 py-3">
              <div className="text-[11px] font-semibold uppercase tracking-widest text-zinc-400 mb-1.5">
                Never attempted
              </div>
              <div className="flex flex-wrap gap-1.5">
                {stats.untouchedTypes.map((t) => (
                  <span
                    key={t}
                    className="rounded-full border border-dashed border-zinc-300 px-2.5 py-0.5 text-xs text-zinc-500"
                  >
                    {CASE_TYPE_LABELS[t]}
                  </span>
                ))}
              </div>
            </div>
          )}
        </Card>
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        <Card className="p-5 lg:col-span-2">
          <div className="flex items-baseline justify-between gap-4 mb-4">
            <h3 className="font-serif text-lg font-bold">Latest cases</h3>
            <Link
              href="/case-log/cases"
              className="text-xs font-semibold uppercase tracking-widest text-zinc-400 hover:text-zinc-900"
            >
              See all
            </Link>
          </div>
          <ul className="-mx-5 -mb-5 border-t border-zinc-100">
            {stats.recent.map((c) => (
              <CaseRow key={c.id} entry={c} />
            ))}
          </ul>
        </Card>

        <Card className="p-5">
          <h3 className="font-serif text-lg font-bold mb-4">Who you case with</h3>
          {stats.byPartner.length === 0 ? (
            <p className="text-sm text-zinc-400">
              Add a name to a case and your regulars show up here.
            </p>
          ) : (
            <ul className="divide-y divide-zinc-100">
              {stats.byPartner.map((p) => (
                <li
                  key={p.name}
                  className="flex items-center justify-between gap-3 py-2"
                >
                  <Link
                    href={`/case-log/cases?partner=${encodeURIComponent(p.name)}`}
                    className="truncate text-sm font-medium text-zinc-800 hover:underline"
                  >
                    {p.name}
                    <span className="ml-2 text-xs font-normal text-zinc-400">
                      {p.count} case{p.count === 1 ? "" : "s"}
                    </span>
                  </Link>
                  <ScorePill value={p.average} />
                </li>
              ))}
            </ul>
          )}

          {stats.best && (
            <div className="mt-5 border-t border-zinc-100 pt-4">
              <div className="text-[11px] font-semibold uppercase tracking-widest text-zinc-400 mb-1">
                Best rep so far
              </div>
              <Link
                href={`/case-log/cases/${stats.best.id}`}
                className="text-sm font-medium text-zinc-800 hover:underline"
              >
                {stats.best.title}
              </Link>
              <div className="mt-1 text-xs text-zinc-500">
                {formatOutOfTen(stats.best.average)}/10 ·{" "}
                {formatDate(stats.best.practiced_on)}
              </div>
            </div>
          )}
        </Card>
      </section>

      <div className="flex justify-center pb-4">
        <Link href="/case-log/cases" className={ghostButtonClass}>
          Browse every case
        </Link>
      </div>
    </div>
  );
}
