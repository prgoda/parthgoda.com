"use client";

import { useRef, useEffect, useState } from "react";

const gaps = [
  {
    tag: "Channel",
    stat: "31%",
    title: "Resellers Underperform",
    body: "Resellers move 1,044 printers — the highest volume — but attach at only 31%. Even a lift to 45% generates ~145 additional plans. This is the single highest-leverage lever.",
    statColor: "text-amber-500",
  },
  {
    tag: "Geography",
    stat: "3%",
    title: "APAC Is Nearly Zero",
    body: "APAC sells 266 printers but only 8 service plans. A structural problem — plans may not be offered, or there is a pricing/distribution gap. Fixing APAC alone could add ~150 plans.",
    statColor: "text-red-500",
  },
  {
    tag: "Price Perception",
    stat: "24%",
    title: "Web Store Opt-Out Rate",
    body: "All three plan tiers are prominently shown. 1-yr is pre-selected by default. Yet 76% of buyers opt out — they see the plan but aren't convinced. This is a value pitch failure, not a UX problem.",
    statColor: "text-red-500",
  },
  {
    tag: "Timing",
    stat: "70%",
    title: "Post-Purchase Conversion Gap",
    body: "With 70% of buyers not taking a plan at purchase, there is an untapped pool to convert via post-sale outreach — but we don't know if this is being attempted.",
    statColor: "text-zinc-500",
  },
];

export default function FormlabsGaps() {
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
      <h2 className="font-serif text-2xl font-bold mb-2">The Data Reveals Three Critical Gaps</h2>
      <p className="text-zinc-500 text-sm mb-8 italic">Hypothesis-driven, to be validated with customer and rep interviews.</p>
      <div className="grid md:grid-cols-2 gap-5">
        {gaps.map((g) => (
          <div key={g.tag} className="border border-zinc-200 rounded-lg p-6">
            <p className="text-xs font-semibold uppercase tracking-widest text-zinc-400 mb-3">{g.tag}</p>
            <p className={`font-serif text-4xl font-bold mb-3 ${g.statColor}`}>{g.stat}</p>
            <h3 className="font-semibold text-zinc-900 mb-2">{g.title}</h3>
            <p className="text-sm text-zinc-600 leading-relaxed">{g.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
