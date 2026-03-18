"use client";

import { useRef, useEffect, useState } from "react";

const kpis = [
  { type: "Primary KPI", title: "Overall Attach Rate", desc: "By channel, region, product. Monthly." },
  { type: "Leading Indicator", title: "Reseller Cert Rate", desc: "% of resellers certified on service plan pitch." },
  { type: "Leading Indicator", title: "Web Store Opt-Out Rate", desc: "% of checkouts where buyer removes the pre-selected plan." },
  { type: "Lagging Indicator", title: "Post-Sale Conversion", desc: "% of plan-less owners who add a plan within 90 days." },
];

const questions = [
  "Why is APAC at 3%? Distribution, pricing, or offer-awareness — one call with the regional team will reveal this.",
  "What do resellers say when they don't offer a plan? Training/tools gap or incentive gap: different fixes.",
  "What is the Web Store checkout opt-out rate and at what step does it occur? Cart analytics will show this immediately.",
  "What is the reseller margin on service plans vs. hardware? Determines whether incentive redesign is needed.",
];

export default function FormlabsMeasure() {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); obs.unobserve(el); } }, { threshold: 0.1 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section ref={ref} className={`py-12 border-b border-zinc-100 resume-slide-up ${visible ? "is-visible" : ""}`}>
      <h2 className="font-serif text-2xl font-bold mb-8">How We'll Measure Success</h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        {kpis.map((k) => (
          <div key={k.title} className="border border-zinc-200 rounded-lg p-4">
            <p className="text-xs font-semibold uppercase tracking-widest text-orange-500 mb-3">{k.type}</p>
            <p className="font-semibold text-zinc-900 text-sm mb-2">{k.title}</p>
            <p className="text-xs text-zinc-500 leading-relaxed">{k.desc}</p>
          </div>
        ))}
      </div>

      <div className="bg-zinc-50 border border-zinc-200 rounded-lg p-6">
        <p className="font-semibold text-zinc-900 mb-4">Questions I'd Prioritize in My First 15 Days</p>
        <ol className="space-y-3">
          {questions.map((q, i) => (
            <li key={i} className="flex gap-3 text-sm text-zinc-600 leading-relaxed">
              <span className="font-semibold text-zinc-400 shrink-0">{i + 1}.</span>
              <span>{q}</span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
