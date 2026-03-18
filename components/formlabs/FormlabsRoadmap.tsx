"use client";

import { useRef, useEffect, useState } from "react";

const quarters = [
  {
    q: "QTR 1",
    theme: "Diagnose & Build",
    target: "38–42%",
    items: [
      "Conduct reseller attach audit by partner",
      "Launch post-purchase opt-out recovery email sequence",
      "Add ROI/cost-of-downtime content to Web Store product pages",
      "Establish APAC availability baseline",
    ],
    accent: "bg-orange-500",
  },
  {
    q: "QTR 2",
    theme: "Activate & Incentivize",
    target: "48–52%",
    items: [
      "Launch reseller certification + tiered margin program",
      "Deploy ROI calculator and case study library",
      "In-Dashboard plan upgrade prompt live",
      "APAC regional pricing/enablement rollout",
    ],
    accent: "bg-zinc-700",
  },
  {
    q: "QTR 3",
    theme: "Optimize & Scale",
    target: "58–62%",
    items: [
      "Optimize attach incentives based on Q1–2 data",
      "Drive 3-year plan adoption with active rep/reseller push",
      "Automated attach tracking dashboard for leadership",
      "Evaluate plan expansion (Fuse Series, Form 4L)",
    ],
    accent: "bg-zinc-400",
  },
];

export default function FormlabsRoadmap() {
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
      <h2 className="font-serif text-2xl font-bold mb-2">3-Quarter Roadmap to 60%</h2>

      {/* Progress bar */}
      <div className="flex items-center gap-3 mb-8 mt-4">
        <span className="text-xs font-mono text-orange-500 font-semibold">30% now</span>
        <div className="flex-1 h-2 bg-zinc-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-orange-500 rounded-full transition-all duration-1000 ease-out"
            style={{ width: visible ? "30%" : "0%" }}
          />
        </div>
        <span className="text-xs font-mono text-zinc-400 font-semibold">→ 60% target</span>
      </div>

      <div className="grid md:grid-cols-3 gap-5">
        {quarters.map((q) => (
          <div key={q.q} className="border border-zinc-200 rounded-lg overflow-hidden">
            <div className={`${q.accent} px-5 py-4`}>
              <div className="flex items-center justify-between">
                <span className="text-white font-bold">{q.q}</span>
                <span className="text-white/80 text-sm font-medium">Target: {q.target}</span>
              </div>
              <p className="text-white/90 text-sm font-medium mt-1">{q.theme}</p>
            </div>
            <div className="px-5 py-5">
              <ul className="space-y-2">
                {q.items.map((item, i) => (
                  <li key={i} className="text-sm text-zinc-600 leading-relaxed flex gap-2">
                    <span className="text-zinc-300 mt-0.5">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
