import { redirect } from "next/navigation";
import { loginAction } from "@/app/case-log/actions";
import { buttonClass } from "@/components/case-log/ui";
import { passphrase } from "@/lib/case-log/auth";

export default async function CaseLogLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; next?: string }>;
}) {
  // With no passphrase set there is nothing to unlock.
  if (!passphrase()) redirect("/case-log");

  const { error, next } = await searchParams;

  return (
    <div className="flex min-h-[70vh] items-center justify-center">
      <form
        action={loginAction}
        className="w-full max-w-sm rounded-xl border border-zinc-200 bg-white p-8"
      >
        <h1 className="font-serif text-2xl font-bold text-zinc-900">
          Case log
        </h1>
        <p className="mt-1 mb-6 text-sm text-zinc-500">
          Private. Enter the passphrase.
        </p>

        <input type="hidden" name="next" value={next ?? "/case-log"} />
        <input
          type="password"
          name="passphrase"
          autoFocus
          autoComplete="current-password"
          placeholder="Passphrase"
          className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-900"
        />

        {error && (
          <p className="mt-2 text-xs text-red-600">
            That is not it. Try again.
          </p>
        )}

        <button type="submit" className={`${buttonClass} mt-4 w-full`}>
          Unlock
        </button>
      </form>
    </div>
  );
}
