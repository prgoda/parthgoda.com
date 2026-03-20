"use client";

import { useRef, useEffect, useState } from "react";

const matches = [
  {
    jd: "Identify and evaluate strategic partnership opportunities across creator tools, media, and marketplace ecosystems",
    parth:
      "At TagTeam, I owned the full BD motion from cold outreach to proposal to close — winning the first enterprise client in 3 months with zero playbook. At RGP, I managed a $9.3M annual revenue portfolio end-to-end, including sourcing, structuring, and closing platform partnerships.",
    icon: "🤝",
  },
  {
    jd: "Structure deals and evaluate deal economics — revenue share, licensing, co-marketing, and integration arrangements",
    parth:
      "Founded and exited Vency Tech at a 6× revenue multiple, negotiating the deal structure myself. Closed a $745K national union platform deal at RGP. Partnership structuring is a listed core skill — I've applied it at every stage from startup to mid-market.",
    icon: "📐",
  },
  {
    jd: "Conduct market research and competitive analysis to prioritize partner targets",
    parth:
      "Led TagTeam's regional expansion into Korea and Indonesia: customer segmentation, competitor mapping, and partner prioritization across both markets. Turned the analysis directly into $185K in market entry revenue — this wasn't a slide deck, it was an executed playbook.",
    icon: "🔍",
  },
  {
    jd: "Understand creator economy dynamics — how creators grow, monetize, and retain audiences",
    parth:
      "I am a creator. I run this site (parthgoda.com), publish AI and GTM content, build AI tools for personal use, and make short-form vibe coding content. I understand what it means to monetize a creative practice — not as an analyst looking in, but as someone doing it.",
    icon: "🎨",
  },
  {
    jd: "Financial modeling and scenario analysis to build business cases for deals",
    parth:
      "Financial modelling, forecast modeling, and pipeline management are explicit skills on my resume — deployed in a consulting context against real commercial decisions. At RGP I built the financial case for a $1M labour-savings platform. These aren't learned-on-the-job skills.",
    icon: "📊",
  },
];

function MatchCard({
  jd,
  parth,
  icon,
  delay,
}: {
  jd: string;
  parth: string;
  icon: string;
  delay: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.unobserve(el);
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -30px 0px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className="resume-slide-up grid md:grid-cols-2 gap-0 border border-zinc-200 rounded-lg overflow-hidden"
      style={
        visible
          ? {
              opacity: 1,
              transform: "none",
              transitionDelay: `${delay}ms`,
            }
          : { transitionDelay: `${delay}ms` }
      }
    >
      {/* JD side */}
      <div className="bg-zinc-50 p-5 border-b md:border-b-0 md:border-r border-zinc-200">
        <p className="text-xs font-semibold uppercase tracking-widest text-zinc-400 mb-2">
          They need
        </p>
        <p className="text-sm text-zinc-600 leading-relaxed">{jd}</p>
      </div>
      {/* Parth side */}
      <div className="bg-white p-5">
        <p className="text-xs font-semibold uppercase tracking-widest text-zinc-400 mb-2">
          {icon} I bring
        </p>
        <p className="text-sm text-zinc-700 leading-relaxed">{parth}</p>
      </div>
    </div>
  );
}

export default function PatreonMatch() {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.unobserve(el);
        }
      },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section ref={ref} className="py-12 border-b border-zinc-100">
      <h2
        className={`font-serif text-2xl font-bold mb-2 resume-slide-up ${
          visible ? "is-visible" : ""
        }`}
      >
        The Match
      </h2>
      <p
        className={`text-zinc-500 text-sm mb-8 resume-slide-up ${
          visible ? "is-visible" : ""
        }`}
        style={{ transitionDelay: "60ms" }}
      >
        Every requirement from the JD, mapped to specific evidence.
      </p>
      <div className="space-y-4">
        {matches.map((m, i) => (
          <MatchCard key={i} {...m} delay={i * 80} />
        ))}
      </div>
    </section>
  );
}
