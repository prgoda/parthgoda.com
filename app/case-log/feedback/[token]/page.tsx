import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { submitFeedbackAction } from "@/app/case-log/actions";
import FeedbackForm from "@/components/case-log/FeedbackForm";
import { Card, buttonClass } from "@/components/case-log/ui";
import { isValidFeedbackToken } from "@/lib/case-log/feedback";

export const metadata: Metadata = {
  title: "Case feedback",
  // A link sent to individuals, not a page meant to be found.
  robots: { index: false, follow: false, nocache: true },
};

export default async function FeedbackPage({
  params,
  searchParams,
}: {
  params: Promise<{ token: string }>;
  searchParams: Promise<{ done?: string }>;
}) {
  const { token } = await params;
  const { done } = await searchParams;

  // A wrong or stale token looks like nothing was ever here.
  if (!(await isValidFeedbackToken(token))) notFound();

  if (done) {
    return (
      <Card className="mx-auto max-w-lg p-8 text-center">
        <h1 className="font-serif text-2xl font-bold text-zinc-900">
          Thank you, genuinely
        </h1>
        <p className="mt-2 text-sm text-zinc-600 leading-relaxed">
          Your feedback is in the log. It is already counting towards the
          averages, which is the whole point — the scores are only useful because
          people like you fill them in honestly.
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <Link href={`/case-log/feedback/${token}`} className={buttonClass}>
            Log another case
          </Link>
          <Link
            href="/case-log"
            className="text-xs text-zinc-400 hover:text-zinc-700"
          >
            See the whole log
          </Link>
        </div>
      </Card>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <header>
        <h1 className="font-serif text-3xl font-bold text-zinc-900">
          How did that case go?
        </h1>
        <p className="text-sm text-zinc-600 mt-2 leading-relaxed">
          Thanks for casing me. Scoring five things separately is far more useful
          to me than one number, because it shows me what to drill next. Takes
          about a minute, and nothing here is required — send what you have.
        </p>
      </header>
      <FeedbackForm action={submitFeedbackAction} token={token} />
    </div>
  );
}
