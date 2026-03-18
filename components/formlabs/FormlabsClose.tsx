"use client";

import { useRef, useEffect, useState } from "react";

const points = [
  { num: "01", text: "Sales Reps prove the value proposition works — 58% attach shows customers say yes when asked properly." },
  { num: "02", text: "The opportunity is concentrated: fix Reseller enablement + APAC activation + Web Store value messaging and you're at 60%. The checkout UX is already sound; buyers need conviction before they get there." },
  { num: "03", text: "The roadmap is sequenced: diagnose in QTR 1, activate in QTR 2, optimize in QTR 3, with clear owners and metrics at each stage." },
];

export default function FormlabsClose() {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); obs.unobserve(el); } }, { threshold: 0.15 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section ref={ref} className={`py-14 resume-slide-up ${visible ? "is-visible" : ""}`}>
      <h2 className="font-serif text-3xl font-bold mb-3">The Case for 60%</h2>
      <p className="text-zinc-500 italic mb-10 text-lg">
        Service attach rate is not a marketing problem or a product problem.<br />
        It is an execution problem, and it is solvable.
      </p>

      <div className="space-y-5 mb-12">
        {points.map((p) => (
          <div key={p.num} className="flex gap-4 items-start">
            <span className="bg-orange-500 text-white text-xs font-bold px-2.5 py-1.5 rounded shrink-0">{p.num}</span>
            <p className="text-zinc-700 leading-relaxed">{p.text}</p>
          </div>
        ))}
      </div>

      <div className="border-t border-zinc-100 pt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <p className="font-semibold text-zinc-900">Parth Goda</p>
          <p className="text-sm text-zinc-500">Kellogg MBA 2027 · Northwestern University</p>
        </div>
        <div className="flex gap-3">
          <a
            href="/formlabs-service-attach-strategy.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-5 py-2.5 bg-zinc-900 text-white text-sm font-semibold rounded-lg hover:bg-zinc-700 transition-colors"
          >
            Download PDF ↗
          </a>
          <a
            href="mailto:prgoda@gmail.com"
            className="inline-block px-5 py-2.5 border border-zinc-300 text-zinc-700 text-sm font-semibold rounded-lg hover:border-zinc-600 transition-colors"
          >
            Get in touch
          </a>
        </div>
      </div>
    </section>
  );
}
