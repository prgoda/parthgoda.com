"use client";

import { useRef, useEffect, useState } from "react";

const stories = [
  {
    tag: "Integration & Platforms",
    title: "I've already solved the Platforms problem.",
    body: `At Deloitte, I architected an AI agent underwriting workflow for a global bank. The job wasn't "build a model" — it was integrating policy data sources, pricing rules, eligibility logic, and human review into a coherent platform other teams could trust. I embedded compliance guardrails, defined the KPI schema, and built the dashboards that let risk and ops teams self-serve. That's SafetyWing's Platforms problem: partner data, pricing sync, eligibility rules, plan state — all needing to flow cleanly across systems. I know what it takes to make that work under real constraints.`,
    metric: "45% faster risk assessment, zero data quality regressions",
  },
  {
    tag: "Roadmap Ownership",
    title: "I've owned roadmaps under pressure, not just contributed to them.",
    body: `At RGP, I built the product-led growth motion for a $745K risk management platform — aligning legal, marketing, engineering, and customer success around a shared outcome. I wasn't coordinating; I was deciding. I ran the discovery, wrote the specs, prioritized the backlog, and shipped. The result cut audit timelines 40% and saved $1M in labour costs. SafetyWing wants an intern who will "gradually own the Platforms area." I've done it with higher stakes than an internship — starting independently rather than gradually is something I'm built for.`,
    metric: "$745K platform, 40% faster audits, $1M in savings",
  },
  {
    tag: "Builder Mindset",
    title: "I've founded, scaled, and exited. Not as a side project — as a company.",
    body: `I founded Vency Tech, a partner relationship management SaaS, during university. I ran discovery, built the MVP, acquired enterprise clients, and exited at a 6× revenue multiple — before I had a first full-time job. Then at TagTeam, a seed-stage AI startup, I scaled the delivery team from 9 people to an enterprise-ready operation, won the first enterprise client in 3 months, and hit $3M ARR. SafetyWing wants people who think independently and take calculated risks. That isn't a posture I'm adopting for this application — it's how I've operated my entire career.`,
    metric: "6× exit at Vency Tech · $3M ARR at TagTeam in 24 months",
  },
];

function StoryCard({
  tag,
  title,
  body,
  metric,
  delay,
}: {
  tag: string;
  title: string;
  body: string;
  metric: string;
  delay: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [expanded, setExpanded] = useState(false);

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
      className={`resume-slide-up border border-zinc-200 rounded-lg p-6 transition-shadow hover:shadow-sm ${
        visible ? "is-visible" : ""
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <p className="text-xs font-semibold uppercase tracking-widest text-zinc-400 mb-3">
        {tag}
      </p>
      <h3 className="font-serif text-lg font-bold text-zinc-900 leading-snug mb-3">
        {title}
      </h3>

      <p
        className={`text-sm text-zinc-600 leading-relaxed overflow-hidden transition-all duration-300 ${
          expanded ? "max-h-[500px]" : "max-h-[3.6rem]"
        }`}
      >
        {body}
      </p>

      <button
        onClick={() => setExpanded(!expanded)}
        className="mt-3 text-xs font-semibold text-zinc-400 hover:text-zinc-700 transition-colors"
      >
        {expanded ? "Show less ↑" : "Read more ↓"}
      </button>

      <div className="mt-4 pt-4 border-t border-zinc-100">
        <p className="text-xs text-zinc-500 font-mono">{metric}</p>
      </div>
    </div>
  );
}

export default function PitchStories() {
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
        Three Stories
      </h2>
      <p
        className={`text-zinc-500 text-sm mb-8 resume-slide-up ${
          visible ? "is-visible" : ""
        }`}
        style={{ transitionDelay: "60ms" }}
      >
        The specific experiences that make me ready for this role on day one.
      </p>
      <div className="space-y-5">
        {stories.map((s, i) => (
          <StoryCard key={i} {...s} delay={i * 100} />
        ))}
      </div>
    </section>
  );
}
