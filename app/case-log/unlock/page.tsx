import Link from "next/link";
import { redirect } from "next/navigation";
import { unlockAction } from "@/app/case-log/actions";
import { buttonClass, Card } from "@/components/case-log/ui";
import { writePin } from "@/lib/case-log/auth";
import { canWrite } from "@/lib/case-log/session";

export default async function UnlockPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; next?: string; unconfigured?: string }>;
}) {
  const { error, next, unconfigured } = await searchParams;

  // Already holding the cookie: nothing to unlock.
  if (await canWrite()) redirect(next ?? "/case-log");

  const configured = writePin() !== null;

  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <Card className="w-full max-w-sm p-8">
        <h1 className="font-serif text-2xl font-bold text-zinc-900">
          Enter your PIN
        </h1>
        <p className="mt-1 text-sm text-zinc-500">
          Reading the log is open to everyone. Adding and editing is not.
        </p>

        {configured ? (
          <form action={unlockAction} className="mt-6">
            <input type="hidden" name="next" value={next ?? "/case-log"} />
            <input
              type="password"
              name="pin"
              autoFocus
              inputMode="numeric"
              autoComplete="current-password"
              maxLength={4}
              pattern="[0-9]*"
              placeholder="····"
              aria-label="4-digit PIN"
              className="w-full rounded-lg border border-zinc-300 px-3 py-3 text-center text-2xl tracking-[0.5em] outline-none focus:border-zinc-900"
            />

            {error && (
              <p className="mt-2 text-xs text-red-600">
                Wrong PIN. Try again.
              </p>
            )}

            <button type="submit" className={`${buttonClass} mt-4 w-full`}>
              Unlock writing
            </button>
          </form>
        ) : (
          <p className="mt-6 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900 leading-relaxed">
            {unconfigured
              ? "No PIN is configured on this deploy, so the log is read-only. Set CASELOG_PIN in the environment to start logging cases here."
              : "Set CASELOG_PIN in the environment to enable writing."}
          </p>
        )}

        <Link
          href="/case-log"
          className="mt-5 block text-center text-xs text-zinc-400 hover:text-zinc-700"
        >
          Back to the log
        </Link>
      </Card>
    </div>
  );
}
