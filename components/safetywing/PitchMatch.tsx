"use client";

import { useRef, useEffect, useState } from "react";

const matches = [
  {
    jd: "Manage partner integrations — data, pricing, eligibility, plan synchronization",
    parth:
      "Architected an AI agent underwriting workflow at a global bank integrating policy data, compliance KPIs, human-in-the-loop review, and risk dashboards across systems — same class of multi-party data sync problem.",
    icon: "🔗",
  },
  {
    jd: "Shape the Platforms roadmap alongside engineering and design",
    parth:
      "Drove outcome-led roadmaps across 6 finance/HR processes with 12 engineers at Deloitte. Cut resolution time 54%. Designed shared outcome dashboards governing a 300-initiative portfolio for a Japanese bank.",
    icon: "🗺️",
  },
  {
    jd: "Entrepreneurial, self-driven mindset — independent thinker",
    parth:
      "Founded Vency Tech at 20 and exited at a 6× revenue multiple. Scaled TagTeam from seed-stage to $3M ARR and enterprise clients in 24 months. Launched $8M AI practice at Deloitte from a blank slate.",
    icon: "🚀",
  },
  {
    jd: "Triage bugs, conduct user research, draft product specs",
    parth:
      "Operationalized user feedback at scale — C-suite workshops with 500+ executives, converted qual insights into scoped pilots. Bug triage, PRDs, and user stories are day-one tools for me, not things to learn on the job.",
    icon: "🔍",
  },
  {
    jd: "6-month full-time commitment, fully remote",
    parth:
      "My whole career has been distributed — managed cross-timezone teams across Singapore, Japan, Korea, Indonesia, and the US. I don't need to learn how to work async; I've never worked any other way.",
    icon: "🌏",
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

export default function PitchMatch() {
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
