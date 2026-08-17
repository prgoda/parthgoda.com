import Link from "next/link";
import { notFound } from "next/navigation";
import { updateCaseAction } from "@/app/case-log/actions";
import CaseForm from "@/components/case-log/CaseForm";
import { getCase } from "@/lib/case-log/queries";
import { formatDate } from "@/lib/dates";

export default async function EditCasePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const numericId = Number(id);
  if (!Number.isInteger(numericId)) notFound();

  const entry = await getCase(numericId);
  if (!entry) notFound();

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <Link
          href={`/case-log/cases/${entry.id}`}
          className="text-xs font-semibold uppercase tracking-widest text-zinc-400 hover:text-zinc-900"
        >
          ← Back to the case
        </Link>
      </div>
      <header>
        <h1 className="font-serif text-3xl font-bold text-zinc-900">
          Edit case
        </h1>
        <p className="text-sm text-zinc-500 mt-1">
          {entry.title} · {formatDate(entry.practiced_on)}
        </p>
      </header>
      <CaseForm
        action={updateCaseAction}
        entry={entry}
        submitLabel="Save changes"
      />
    </div>
  );
}
