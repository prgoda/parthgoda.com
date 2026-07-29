import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "The 7 Flavors of FDE",
  description:
    "Forward Deployed Engineer is a spectrum, not one job. A 1-minute read on the two axes that define it and how to prep for all 7 flavors.",
  robots: { index: false },
};

const FLAVORS = [
  {
    name: "Consultant FDE",
    dot: "bg-amber-500",
    where: "Pre-sales → implementation",
    depth: "Slides & emails",
    prep: "Master the product story and workflow mapping. Sharpen discovery, decks, and demos. The depth here is business judgment, not code.",
  },
  {
    name: "Solutions FDE",
    dot: "bg-amber-500",
    where: "Pre-sales",
    depth: "Custom demos & config",
    prep: "Build fast, convincing demos. Know the platform's config, APIs, and integrations well enough to wire a POC live on a call.",
  },
  {
    name: "Implementation FDE",
    dot: "bg-amber-500",
    where: "Implementation",
    depth: "Config → integration code",
    prep: "Get strong at integrations, data plumbing, and deployment. You own reliability and the handoff from signed deal to production.",
  },
  {
    name: "Customer Success FDE",
    dot: "bg-amber-500",
    where: "Post-sales → renewal",
    depth: "Demos → config",
    prep: "Drive adoption, troubleshooting, and expansion. Light building plus the relationship skills that turn usage into renewals.",
  },
  {
    name: "Mature-platform FDE",
    dot: "bg-emerald-500",
    where: "Implementation → post-sales",
    depth: "Integration → in-platform code",
    prep: "Real software engineering in the platform's stack. You extend the product itself, so treat it as a SWE role with customers attached.",
  },
  {
    name: "Applied AI FDE",
    dot: "bg-purple-500",
    where: "Pre-sales & early",
    depth: "In-platform code + evals / data training",
    prep: "Build agents and LLM features, write evals, and train on customer data. Pragmatic ML and prompt/dataset craft beat research chops.",
  },
  {
    name: "Immature-platform FDE",
    dot: "bg-blue-600",
    where: "The entire cycle",
    depth: "Everything, up to building new platform capability",
    prep: "Founder-mode generalist: full-stack building, product instinct, and selling at once. You ship the next platform capability while closing the deal.",
  },
];

export default function FdeFlavorsPage() {
  return (
    <article className="max-w-2xl mx-auto">
      {/* Header */}
      <header className="mb-8">
        <div className="flex items-center gap-3 text-xs font-semibold uppercase tracking-widest text-zinc-400 mb-4">
          <span>Forward Deployed Engineer</span>
          <span>·</span>
          <span>1 min read</span>
        </div>
        <h1 className="font-serif text-4xl md:text-5xl font-bold leading-tight text-zinc-900">
          FDE is a spectrum, not a title
        </h1>
        <p className="mt-5 text-lg text-zinc-600 leading-relaxed">
          &ldquo;Forward Deployed Engineer&rdquo; on a job post tells you almost
          nothing. The role lives on two axes at once, and where a company plots
          you decides what you actually do all day.
        </p>
      </header>

      {/* The two axes */}
      <section className="grid sm:grid-cols-2 gap-4 mb-10">
        <div className="border border-zinc-200 rounded-lg p-5">
          <div className="text-xs font-semibold uppercase tracking-widest text-zinc-400 mb-2">
            Axis 1 · Sales cycle
          </div>
          <p className="text-sm text-zinc-600 leading-relaxed">
            <em>Where</em> you operate: pre-sales → implementation → post-sales
            → renewal.
          </p>
        </div>
        <div className="border border-zinc-200 rounded-lg p-5">
          <div className="text-xs font-semibold uppercase tracking-widest text-zinc-400 mb-2">
            Axis 2 · Technical depth
          </div>
          <p className="text-sm text-zinc-600 leading-relaxed">
            <em>How deep</em> you go: from slides & emails, up through demos,
            config, integration code, in-platform code, evals, to building new
            platform capability.
          </p>
        </div>
      </section>

      {/* The 7 flavors */}
      <h2 className="font-serif text-2xl font-bold text-zinc-900 mb-5">
        The 7 flavors, and how to prep
      </h2>
      <div className="space-y-3 mb-10">
        {FLAVORS.map((f) => (
          <div key={f.name} className="border border-zinc-200 rounded-lg p-5">
            <div className="flex items-center gap-2.5 mb-1.5">
              <span className={`w-2.5 h-2.5 rounded-full ${f.dot}`} />
              <h3 className="font-semibold text-zinc-900">{f.name}</h3>
            </div>
            <div className="text-xs text-zinc-400 mb-2">
              {f.where} <span className="mx-1">·</span> {f.depth}
            </div>
            <p className="text-sm text-zinc-600 leading-relaxed">
              <span className="font-medium text-zinc-700">Prep:</span> {f.prep}
            </p>
          </div>
        ))}
      </div>

      {/* Takeaway */}
      <div className="bg-zinc-50 border border-zinc-200 rounded-lg p-6 mb-10">
        <div className="text-xs font-semibold uppercase tracking-widest text-zinc-400 mb-2">
          The takeaway
        </div>
        <p className="text-zinc-700 leading-relaxed">
          Before you prep for &ldquo;an FDE role,&rdquo; pin it on both axes:
          how deep technically, and where in the sales cycle. Then train for
          that quadrant. The same title can mean writing decks or building the
          platform.
        </p>
      </div>

      {/* Newsletter CTA */}
      <div className="bg-zinc-900 rounded-lg p-6 mb-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="font-serif text-lg font-bold text-white">
            Get the FDE Dispatch
          </div>
          <p className="text-sm text-zinc-400 mt-1">
            Short, practical notes on shipping AI into real workflows.
          </p>
        </div>
        <a
          href="/newsletter"
          className="shrink-0 self-start sm:self-auto rounded-lg bg-white px-5 py-2.5 text-sm font-semibold uppercase tracking-wider text-zinc-900 hover:bg-zinc-200 transition-colors"
        >
          Subscribe →
        </a>
      </div>

      {/* Source + related */}
      <p className="text-sm text-zinc-500 border-t border-zinc-200 pt-6">
        Built on the diagram &ldquo;The 7 Flavors of FDE in 2026&rdquo; from{" "}
        <a
          href="https://fdeverything.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-zinc-900 font-medium underline underline-offset-4 hover:text-zinc-600"
        >
          fdeverything.com ↗
        </a>
        . New to the role? Start with the{" "}
        <Link
          href="/forward-deployed-engineer"
          className="text-zinc-900 font-medium underline underline-offset-4 hover:text-zinc-600"
        >
          1-minute FDE primer
        </Link>
        .
      </p>
    </article>
  );
}
