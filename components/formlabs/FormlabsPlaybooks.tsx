"use client";

import { useRef, useEffect, useState } from "react";

const playbooks = [
  {
    channel: "Reseller",
    current: "31%",
    target: "55%",
    sections: [
      {
        label: "Enablement",
        items: [
          { title: "Co-Branded Pitch Deck + ROI Calculator", body: "Resellers won't build their own materials. Provide ready-to-use assets with their logo already slotted in." },
          { title: "Quarterly Business Review Add-On", body: "Include each partner's attach rate alongside hardware revenue in every quarterly review. Peer benchmarking drives competitive behaviour." },
          { title: "'First Plan Free' Launch Incentive", body: "Waive the first service plan margin requirement on the next 10 plans sold. Gets reps into the habit of offering plans." },
        ],
      },
      {
        label: "Incentives",
        items: [
          { title: "Tiered Margin Structure", body: "Resellers hitting 40%+ attach earn an additional 3–5% margin on all service plans that quarter. Funded by incremental plan revenue." },
          { title: "Deal Registration Bonus for Plans", body: "When a reseller registers a deal that includes a service plan, they receive a higher deal registration bonus than hardware-only deals." },
          { title: "Dedicated Channel Manager Attach KPI", body: "Makes plan inclusion a commercial priority, tracked in every partner review." },
        ],
      },
    ],
  },
  {
    channel: "Web Store",
    current: "24%",
    target: "50%",
    sections: [
      {
        label: "Pre-Sale",
        items: [
          { title: "Pre-Checkout ROI Case", body: "76% still opt out despite seeing all 3 plan tiers. The value case must be made on product pages before checkout — lead with cost-of-downtime, not feature lists." },
          { title: "Case Studies", body: "Feature customers who used hot-swap replacement to avoid production shutdowns. Dental use case is particularly compelling." },
          { title: "Sales Enablement", body: "Email templates, talk tracks, and objection handlers for reps and resellers to use at point of sale." },
        ],
      },
      {
        label: "Post-Sale",
        items: [
          { title: "30-Day Email", body: "Trigger to every plan-less buyer: 'Your printer warranty window — protect your uptime now.' While new-product anxiety is highest." },
          { title: "60-Day Nurture", body: "Customer story about production downtime prevention. Quantified business impact. Limited-time upgrade offer." },
          { title: "In-Dashboard Prompt", body: "Surface plan upgrade in Formlabs Dashboard for unprotected printers. Highest-context intervention." },
        ],
      },
    ],
  },
  {
    channel: "APAC",
    current: "3%",
    target: "35%",
    sections: [
      {
        label: "Diagnose First",
        items: [
          { title: "Distributor Audit", body: "One structured call per APAC distributor: 'Walk me through your last 5 printer sales — at which point did you present the service plan?' If they can't answer, the plan isn't being pitched." },
          { title: "Pricing Localisation Analysis", body: "Map plan price as % of printer ASP by country vs. AMER/EMEA. A pricing mismatch is a quick fix; a fundamental affordability gap is a different conversation." },
          { title: "Support Language Barrier Check", body: "Formlabs support is listed in English, German, French, and Italian only. If APAC buyers can't access support in their language, that's a product gap that must be fixed before pushing sales." },
        ],
      },
      {
        label: "Activate Based on What We Learn",
        items: [
          { title: "If Training Gap: Reseller Certification", body: "Adapt the global program with local currency pricing and translated materials for JP, KR, AU, SG as a minimum." },
          { title: "If Pricing Gap: Local Plan Pricing", body: "A 15–20% price reduction anchored to local printer ASP, tested in Australia first, before regional rollout." },
          { title: "APAC Pilot Country", body: "Go deep in one high-volume market for 6 months. Full enablement, localised pricing, localised support. Use results to build the business case for the region." },
        ],
      },
    ],
  },
];

function Playbook({ pb, delay }: { pb: typeof playbooks[0]; delay: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); obs.unobserve(el); } }, { threshold: 0.08 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`resume-slide-up border border-zinc-200 rounded-lg overflow-hidden ${visible ? "is-visible" : ""}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div className="bg-zinc-900 px-6 py-4 flex items-center justify-between">
        <h3 className="text-white font-bold text-lg">{pb.channel}</h3>
        <div className="flex items-center gap-3 text-sm">
          <span className="text-red-400 font-semibold">{pb.current}</span>
          <span className="text-zinc-500">→</span>
          <span className="text-emerald-400 font-semibold">{pb.target}</span>
        </div>
      </div>
      <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-zinc-100">
        {pb.sections.map((sec) => (
          <div key={sec.label} className="p-5">
            <p className="text-xs font-semibold uppercase tracking-widest text-orange-500 mb-4">{sec.label}</p>
            <div className="space-y-4">
              {sec.items.map((item) => (
                <div key={item.title} className="border-l-2 border-zinc-200 pl-3">
                  <p className="text-sm font-semibold text-zinc-800 mb-1">{item.title}</p>
                  <p className="text-xs text-zinc-500 leading-relaxed">{item.body}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function FormlabsPlaybooks() {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); obs.unobserve(el); } }, { threshold: 0.05 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section ref={ref} className="py-12 border-b border-zinc-100">
      <h2 className={`font-serif text-2xl font-bold mb-2 resume-slide-up ${visible ? "is-visible" : ""}`}>
        Channel Playbooks
      </h2>
      <p className={`text-zinc-500 text-sm mb-8 resume-slide-up ${visible ? "is-visible" : ""}`} style={{ transitionDelay: "60ms" }}>
        Detailed tactics for each channel — what to do, in what order, and why.
      </p>
      <div className="space-y-6">
        {playbooks.map((pb, i) => <Playbook key={pb.channel} pb={pb} delay={i * 80} />)}
      </div>
    </section>
  );
}
