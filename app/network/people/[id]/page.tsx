import Link from "next/link";
import { notFound } from "next/navigation";
import {
  archiveAction,
  deleteInteractionAction,
  markRespondedAction,
  snoozeAction,
} from "@/app/network/actions";
import LogInteractionForm from "@/components/network/LogInteractionForm";
import {
  Card,
  ClosenessBadge,
  StatusPill,
  ghostButtonClass,
} from "@/components/network/ui";
import {
  GENDER_LABELS,
  cadenceLabel,
  formatDate,
  humanGap,
} from "@/lib/network/cadence";
import { getInteractions, getPerson } from "@/lib/network/queries";
import type { Interaction } from "@/lib/network/types";

function DetailRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex gap-3 py-2 border-b border-zinc-100 last:border-b-0">
      <dt className="w-28 shrink-0 text-[11px] font-semibold uppercase tracking-widest text-zinc-400 pt-0.5">
        {label}
      </dt>
      <dd className="min-w-0 flex-1 text-sm text-zinc-700 break-words">{children}</dd>
    </div>
  );
}

function TimelineItem({
  interaction,
  personId,
}: {
  interaction: Interaction;
  personId: number;
}) {
  const inbound = interaction.direction === "inbound";
  return (
    <li className="relative pl-6 pb-5 last:pb-0">
      <span
        className={`absolute left-0 top-1.5 h-2.5 w-2.5 rounded-full ring-4 ring-white ${
          inbound ? "bg-emerald-500" : "bg-zinc-900"
        }`}
      />
      <span className="absolute left-[4.5px] top-5 bottom-0 w-px bg-zinc-200 last:hidden" />

      <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
        <span className="text-sm font-semibold text-zinc-900">
          {formatDate(interaction.occurred_on)}
        </span>
        <span className="text-xs text-zinc-500">
          {inbound ? "they reached out" : "I reached out"} · {interaction.channel}
        </span>
        {!inbound &&
          (interaction.responded ? (
            <span className="text-xs font-medium text-emerald-600">replied</span>
          ) : (
            <span className="text-xs text-amber-600">no reply</span>
          ))}
      </div>

      {interaction.note && (
        <p className="mt-1 text-sm text-zinc-600 leading-relaxed">{interaction.note}</p>
      )}

      <div className="mt-1.5 flex gap-3 text-[11px] text-zinc-400">
        {!inbound && (
          <form action={markRespondedAction}>
            <input type="hidden" name="id" value={interaction.id} />
            <input type="hidden" name="person_id" value={personId} />
            <input
              type="hidden"
              name="responded"
              value={interaction.responded ? "0" : "1"}
            />
            <button type="submit" className="hover:text-zinc-800 hover:underline">
              {interaction.responded ? "Mark unanswered" : "Mark replied"}
            </button>
          </form>
        )}
        <form action={deleteInteractionAction}>
          <input type="hidden" name="id" value={interaction.id} />
          <input type="hidden" name="person_id" value={personId} />
          <button type="submit" className="hover:text-red-600 hover:underline">
            Delete
          </button>
        </form>
      </div>
    </li>
  );
}

export default async function PersonPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const person = getPerson(Number(id));
  if (!person) notFound();

  const interactions = getInteractions(person.id);
  const tags = person.tags?.split(",").map((t) => t.trim()).filter(Boolean) ?? [];

  return (
    <div className="space-y-6">
      <Link
        href="/network/people"
        className="text-xs font-semibold uppercase tracking-widest text-zinc-400 hover:text-zinc-900"
      >
        ← Everyone
      </Link>

      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="font-serif text-3xl font-bold text-zinc-900">
              {person.name}
            </h1>
            <StatusPill person={person} />
            {person.archived === 1 && (
              <span className="rounded-full bg-zinc-100 px-2.5 py-1 text-[11px] font-semibold text-zinc-500">
                Archived
              </span>
            )}
          </div>
          <p className="mt-2 text-sm text-zinc-500">
            {person.last_contact
              ? `Last spoke ${humanGap(person.days_since_contact ?? 0)}. `
              : "No conversation logged yet. "}
            Next touch due {formatDate(person.due_on)}.
          </p>
        </div>
        <Link href={`/network/people/${person.id}/edit`} className={ghostButtonClass}>
          Edit
        </Link>
      </header>

      <div className="grid gap-6 lg:grid-cols-[1fr_20rem]">
        <div className="space-y-6 lg:order-1">
          <LogInteractionForm personId={person.id} />

          <Card className="p-5">
            <h2 className="font-serif text-lg font-bold mb-4">
              History
              <span className="ml-2 text-sm font-normal text-zinc-400">
                {interactions.length}
              </span>
            </h2>
            {interactions.length === 0 ? (
              <p className="text-sm text-zinc-400">
                Nothing logged yet. Log the first conversation above and the
                cadence clock starts running.
              </p>
            ) : (
              <ul className="relative">
                {interactions.map((i) => (
                  <TimelineItem key={i.id} interaction={i} personId={person.id} />
                ))}
              </ul>
            )}
          </Card>
        </div>

        <aside className="space-y-4 lg:order-2">
          <Card className="p-5">
            <h2 className="font-serif text-lg font-bold mb-2">Details</h2>
            <dl>
              <DetailRow label="Closeness">
                <ClosenessBadge value={person.closeness} />
              </DetailRow>
              <DetailRow label="Cadence">{cadenceLabel(person.cadence_days)}</DetailRow>
              {person.email && (
                <DetailRow label="Email">
                  <a href={`mailto:${person.email}`} className="hover:underline">
                    {person.email}
                  </a>
                </DetailRow>
              )}
              {person.phone && (
                <DetailRow label="Phone">
                  <a
                    href={`tel:${person.phone.replace(/\s/g, "")}`}
                    className="hover:underline"
                  >
                    {person.phone}
                  </a>
                </DetailRow>
              )}
              {person.linkedin && (
                <DetailRow label="LinkedIn">
                  <a
                    href={
                      person.linkedin.startsWith("http")
                        ? person.linkedin
                        : `https://linkedin.com/in/${person.linkedin}`
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline"
                  >
                    {person.linkedin}
                  </a>
                </DetailRow>
              )}
              {(person.role || person.company) && (
                <DetailRow label="Work">
                  {[person.role, person.company].filter(Boolean).join(" at ")}
                </DetailRow>
              )}
              {person.location && <DetailRow label="Based">{person.location}</DetailRow>}
              {person.where_met && (
                <DetailRow label="Met at">
                  {person.where_met}
                  {person.met_year ? `, ${person.met_year}` : ""}
                </DetailRow>
              )}
              <DetailRow label="Gender">{GENDER_LABELS[person.gender]}</DetailRow>
              {tags.length > 0 && (
                <DetailRow label="Tags">
                  <span className="flex flex-wrap gap-1.5">
                    {tags.map((t) => (
                      <Link
                        key={t}
                        href={`/network/people?tag=${encodeURIComponent(t)}`}
                        className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs text-zinc-600 hover:bg-zinc-200"
                      >
                        {t}
                      </Link>
                    ))}
                  </span>
                </DetailRow>
              )}
              {person.snooze_until && (
                <DetailRow label="Snoozed">
                  until {formatDate(person.snooze_until)}
                </DetailRow>
              )}
            </dl>
          </Card>

          {person.notes && (
            <Card className="p-5">
              <h2 className="font-serif text-lg font-bold mb-2">Notes</h2>
              <p className="whitespace-pre-wrap text-sm text-zinc-600 leading-relaxed">
                {person.notes}
              </p>
            </Card>
          )}

          <Card className="p-5">
            <h2 className="font-serif text-lg font-bold mb-3">Quiet for a while</h2>
            <div className="flex flex-wrap gap-1.5">
              {[
                { label: "1 week", days: 7 },
                { label: "1 month", days: 30 },
                { label: "3 months", days: 90 },
              ].map((o) => (
                <form key={o.days} action={snoozeAction}>
                  <input type="hidden" name="id" value={person.id} />
                  <input type="hidden" name="days" value={o.days} />
                  <button
                    type="submit"
                    className="rounded-full border border-zinc-300 px-3 py-1 text-xs text-zinc-600 transition-colors hover:border-zinc-900 hover:text-zinc-900"
                  >
                    {o.label}
                  </button>
                </form>
              ))}
              {person.snooze_until && (
                <form action={snoozeAction}>
                  <input type="hidden" name="id" value={person.id} />
                  <input type="hidden" name="days" value="0" />
                  <button
                    type="submit"
                    className="rounded-full border border-zinc-300 px-3 py-1 text-xs text-zinc-600 hover:border-zinc-900"
                  >
                    Wake up
                  </button>
                </form>
              )}
            </div>

            <form action={archiveAction} className="mt-4 border-t border-zinc-100 pt-4">
              <input type="hidden" name="id" value={person.id} />
              <input type="hidden" name="archived" value={person.archived ? "0" : "1"} />
              <button
                type="submit"
                className="text-xs text-zinc-400 transition-colors hover:text-zinc-800 hover:underline"
              >
                {person.archived
                  ? "Restore to active list"
                  : "Archive (keep the record, stop the reminders)"}
              </button>
            </form>
          </Card>
        </aside>
      </div>
    </div>
  );
}
