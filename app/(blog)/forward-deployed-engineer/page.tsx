import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Forward Deployed Engineer",
  description:
    "A one-minute read on what a Forward Deployed Engineer is and the 30-day blueprint to become one.",
  robots: { index: false },
};

const WEEKS = [
  {
    range: "Days 1–7",
    title: "Build",
    body: "Ship an agent that completes one real workflow end-to-end, with full visibility into every step.",
  },
  {
    range: "Days 8–14",
    title: "Stabilize",
    body: "Turn the demo into a production system: structured outputs, checkpointing, and failure recovery.",
  },
  {
    range: "Days 15–21",
    title: "Measure",
    body: "Evaluate against a golden dataset. Find failure modes, quantify cost, prove reliability.",
  },
  {
    range: "Days 22–30",
    title: "Document & Defend",
    body: "Write a case study that holds up to both engineers and executives.",
  },
];

export default function ForwardDeployedEngineerPage() {
  return (
    <article className="max-w-2xl mx-auto">
      {/* Header */}
      <header className="mb-10">
        <div className="flex items-center gap-3 text-xs font-semibold uppercase tracking-widest text-zinc-400 mb-4">
          <span>Forward Deployed Engineer</span>
          <span>·</span>
          <span>1 min read</span>
        </div>
        <h1 className="font-serif text-4xl md:text-5xl font-bold leading-tight text-zinc-900">
          The FDE, in a nutshell
        </h1>
        <p className="mt-5 text-lg text-zinc-600 leading-relaxed">
          A Forward Deployed Engineer sits between the business and the AI —
          finding where intelligence belongs inside real workflows and shipping
          systems that carry actual responsibility.
        </p>
      </header>

      {/* Pull quote */}
      <blockquote className="border-l-2 border-zinc-900 pl-5 my-10">
        <p className="font-serif text-xl md:text-2xl italic leading-snug text-zinc-800">
          “The edge is no longer who has intelligence. It’s where, how, and why
          they use it.”
        </p>
      </blockquote>

      <p className="text-zinc-700 leading-relaxed mb-8">
        Everyone can reach the same foundation models now, so the advantage moves
        to <em>deployment</em>. That takes a rare pairing of two skills:
      </p>

      {/* Duality */}
      <div className="grid sm:grid-cols-2 gap-4 mb-12">
        <div className="border border-zinc-200 rounded-lg p-5">
          <h3 className="font-semibold text-zinc-900 mb-1">Commercial judgment</h3>
          <p className="text-sm text-zinc-600 leading-relaxed">
            Workflows, costs, risks, incentives, and what actually blocks
            adoption.
          </p>
        </div>
        <div className="border border-zinc-200 rounded-lg p-5">
          <h3 className="font-semibold text-zinc-900 mb-1">Technical execution</h3>
          <p className="text-sm text-zinc-600 leading-relaxed">
            Reliable systems that handle failure and manage data flows in
            production.
          </p>
        </div>
      </div>

      {/* 30-day plan */}
      <h2 className="font-serif text-2xl font-bold text-zinc-900 mb-6">
        The 30-day blueprint
      </h2>
      <ol className="space-y-4 mb-12">
        {WEEKS.map((w, i) => (
          <li key={w.title} className="flex gap-4">
            <div className="shrink-0 w-8 h-8 rounded-full bg-zinc-900 text-white text-sm font-bold flex items-center justify-center">
              {i + 1}
            </div>
            <div>
              <div className="flex items-baseline gap-3">
                <span className="font-semibold text-zinc-900">{w.title}</span>
                <span className="text-xs uppercase tracking-widest text-zinc-400">
                  {w.range}
                </span>
              </div>
              <p className="text-sm text-zinc-600 leading-relaxed mt-1">
                {w.body}
              </p>
            </div>
          </li>
        ))}
      </ol>

      {/* Takeaway */}
      <div className="bg-zinc-50 border border-zinc-200 rounded-lg p-6 mb-10">
        <div className="text-xs font-semibold uppercase tracking-widest text-zinc-400 mb-2">
          The takeaway
        </div>
        <p className="text-zinc-700 leading-relaxed">
          Start with an <strong>audit</strong>, not a build. Map the real
          workflow first, then decide what to automate (deterministic), what
          needs an agent (variable paths, clear goals), and what stays human
          (ambiguity and irreversible calls).
        </p>
      </div>

      {/* Source */}
      <p className="text-sm text-zinc-500 border-t border-zinc-200 pt-6">
        Summarized from{" "}
        <a
          href="https://learn.varickagents.com/fde-in-30-days"
          target="_blank"
          rel="noopener noreferrer"
          className="text-zinc-900 font-medium underline underline-offset-4 hover:text-zinc-600"
        >
          “FDE in 30 Days” by Varick Agents ↗
        </a>
        .
      </p>
    </article>
  );
}
