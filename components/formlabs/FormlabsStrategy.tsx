"use client";

import { useRef, useEffect, useState } from "react";

const pillars = [
  {
    num: "01",
    title: "Reseller Enablement",
    impact: "+~145 plans/period",
    items: [
      "Structured service plan certification for all resellers",
      "Co-branded pitch decks + ROI calculators",
      "Tiered bonus: resellers hitting 45%+ attach earn additional margin",
      "Monthly attach scorecards shared with partner managers",
    ],
  },
  {
    num: "02",
    title: "Web Store Conversion",
    impact: "+~30 plans/period",
    items: [
      "76% opt-out: buyers need ROI case before checkout",
      "A/B test: cost-of-downtime vs. 'X years free' framing",
      "Post-purchase email sequence to convert the 76% who opted out",
      "Pre-checkout case studies and ROI content on product pages",
    ],
  },
  {
    num: "03",
    title: "APAC Market Activation",
    impact: "+~80 plans/period",
    items: [
      "Audit: are plans actively being offered in APAC?",
      "Partner with regional distributors on plan training",
      "Evaluate pricing localization vs. global pricing",
      "Dedicated APAC service plan KPI and owner",
    ],
  },
];

export default function FormlabsStrategy() {
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
      <h2 className="font-serif text-2xl font-bold mb-2">Three-Pillar Strategy to Reach 60%</h2>
      <p className="text-zinc-500 text-sm mb-8">Combined estimated impact: +255 plans/period, enough to reach target.</p>
      <div className="grid md:grid-cols-3 gap-5">
        {pillars.map((p, i) => (
          <div key={p.num} className="border border-zinc-200 rounded-lg overflow-hidden flex flex-col">
            <div className={`px-5 py-4 ${i === 0 ? "bg-orange-500" : i === 1 ? "bg-zinc-900" : "bg-amber-700"}`}>
              <span className="text-white font-bold text-lg">{p.num}</span>
              <p className="text-white font-semibold mt-0.5">{p.title}</p>
            </div>
            <div className="px-5 py-5 flex-1">
              <ul className="space-y-2">
                {p.items.map((item, j) => (
                  <li key={j} className="text-sm text-zinc-600 leading-relaxed flex gap-2">
                    <span className="text-zinc-300 mt-0.5">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="px-5 py-3 bg-zinc-50 border-t border-zinc-100">
              <p className="text-xs font-semibold text-zinc-500">Est. Impact: <span className="text-zinc-900">{p.impact}</span></p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
