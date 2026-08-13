import Link from "next/link";
import { notFound } from "next/navigation";
import PersonForm from "@/components/network/PersonForm";
import { deletePersonAction, updatePersonAction } from "@/app/network/actions";
import { Card } from "@/components/network/ui";
import { getPerson } from "@/lib/network/queries";

export default async function EditPersonPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const person = getPerson(Number(id));
  if (!person) notFound();

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <header>
        <Link
          href={`/network/people/${person.id}`}
          className="text-xs font-semibold uppercase tracking-widest text-zinc-400 hover:text-zinc-900"
        >
          ← {person.name}
        </Link>
        <h1 className="font-serif text-3xl font-bold text-zinc-900 mt-2">
          Edit details
        </h1>
      </header>

      <PersonForm
        action={updatePersonAction}
        person={person}
        submitLabel="Save changes"
      />

      <Card className="border-red-200 p-5">
        <h2 className="font-serif text-lg font-bold text-zinc-900">
          Delete permanently
        </h2>
        <p className="text-sm text-zinc-500 mt-1 mb-4">
          Removes {person.name} and all {person.interaction_count} logged
          conversations. Archiving is usually what you want instead.
        </p>
        <form action={deletePersonAction}>
          <input type="hidden" name="id" value={person.id} />
          <button
            type="submit"
            className="rounded-lg border border-red-300 px-4 py-2 text-sm font-semibold text-red-700 transition-colors hover:bg-red-50"
          >
            Delete {person.name}
          </button>
        </form>
      </Card>
    </div>
  );
}
