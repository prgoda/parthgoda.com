import PersonForm from "@/components/network/PersonForm";
import { createPersonAction } from "@/app/network/actions";

export default function NewPersonPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <header>
        <h1 className="font-serif text-3xl font-bold text-zinc-900">
          Add someone
        </h1>
        <p className="text-sm text-zinc-500 mt-1">
          Name is the only thing you need. Everything else can come later.
        </p>
      </header>
      <PersonForm action={createPersonAction} submitLabel="Add to network" />
    </div>
  );
}
