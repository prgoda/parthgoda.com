import type { Metadata } from "next";
import Link from "next/link";
import SubstackEmbed from "@/components/newsletter/SubstackEmbed";

// ─────────────────────────────────────────────────────────────
// Put your Substack subdomain between the quotes, just the name,
// e.g. "fdedispatch" for https://fdedispatch.substack.com.
// While this is empty, the signup box shows a "opening shortly" note.
const SUBSTACK_PUBLICATION = "parthgoda";
// ─────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  title: "Newsletter",
  description:
    "The FDE Dispatch, short, practical notes on Forward Deployed Engineering: shipping AI into real workflows.",
};

const WHAT_YOU_GET = [
  "Field notes on deploying AI into real workflows, what works, what breaks.",
  "The commercial + technical judgment that separates a demo from production.",
  "Short and practical. A few minutes, no fluff.",
];

export default function NewsletterPage() {
  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <header className="mb-8">
        <div className="text-xs font-semibold uppercase tracking-widest text-zinc-400 mb-4">
          Newsletter
        </div>
        <h1 className="font-serif text-4xl md:text-5xl font-bold leading-tight text-zinc-900">
          The FDE Dispatch
        </h1>
        <p className="mt-5 text-lg text-zinc-600 leading-relaxed">
          Short, practical notes on Forward Deployed Engineering, finding where
          AI belongs inside real workflows and shipping systems that carry real
          responsibility. FDE-focused for now.
        </p>
      </header>

      {/* Subscribe */}
      <section className="rounded-xl border border-zinc-200 bg-zinc-50 p-6 md:p-8 mb-12">
        <h2 className="font-serif text-xl font-bold text-zinc-900 mb-1">
          Subscribe
        </h2>
        <p className="text-sm text-zinc-600 mb-5">
          Get each issue in your inbox. Free, and unsubscribe anytime.
        </p>
        <SubstackEmbed publication={SUBSTACK_PUBLICATION || undefined} />
      </section>

      {/* What you'll get */}
      <section className="mb-12">
        <h2 className="font-serif text-2xl font-bold text-zinc-900 mb-5">
          What you’ll get
        </h2>
        <ul className="space-y-3">
          {WHAT_YOU_GET.map((item) => (
            <li key={item} className="flex gap-3 text-zinc-700 leading-relaxed">
              <span className="mt-1 text-zinc-900">→</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Archive */}
      <section className="mb-4">
        <h2 className="font-serif text-2xl font-bold text-zinc-900 mb-5">
          Issues
        </h2>
        <div className="rounded-lg border border-dashed border-zinc-300 bg-zinc-50 px-5 py-6 text-sm text-zinc-500">
          The first issue is on its way. In the meantime, read the{" "}
          <Link
            href="/forward-deployed-engineer"
            className="text-zinc-900 font-medium underline underline-offset-4 hover:text-zinc-600"
          >
            1-minute FDE primer
          </Link>
          .
        </div>
      </section>
    </div>
  );
}
