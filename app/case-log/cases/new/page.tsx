import { createCaseAction } from "@/app/case-log/actions";
import CaseForm from "@/components/case-log/CaseForm";

export default function NewCasePage() {
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <header>
        <h1 className="font-serif text-3xl font-bold text-zinc-900">
          Log a case
        </h1>
        <p className="text-sm text-zinc-500 mt-1">
          Do it within the hour. The feedback you write cold is worth half as
          much.
        </p>
      </header>
      <CaseForm action={createCaseAction} submitLabel="Save case" />
    </div>
  );
}
