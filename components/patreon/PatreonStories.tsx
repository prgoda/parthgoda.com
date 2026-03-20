"use client";

import { useRef, useEffect, useState } from "react";

const stories = [
  {
    tag: "The BD Operator",
    title: "I've built a BD motion from scratch — no playbook, no warm intro.",
    body: `When I joined TagTeam, there was no enterprise sales process. I built it. Cold outreach strategy, discovery frameworks, proposal templates, negotiation prep — all of it from zero. In 3 months I closed the first enterprise client. In 24 months, the company hit $3M ARR. At the same time I was running market entry into Korea and Indonesia: segmenting the market, mapping competitors, and prioritizing the 3 partner types that would move fastest. That analysis turned into $185K in market entry revenue. Patreon's BD team is building a partnership motion across a complex creator economy ecosystem. I know exactly what that early-stage work feels like — because I've done it under pressure without a net.`,
    metric: "$3M ARR at TagTeam · $185K market entry in 2 new geos",
  },
  {
    tag: "The Creator Native",
    title: "I'm not analyzing the creator economy. I'm in it.",
    body: `I run parthgoda.com — I write about AI, GTM strategy, and building in public. I've built an AI workout app for my own use. I make short-form vibe coding content. I built a franchise management SaaS. I understand what it means to try to monetize creative work: the tension between building an audience and generating revenue, the platforms you depend on, the tools you wish existed. When Patreon talks about helping creators "fund the creative class," that's not an abstract mission to me — it's the problem I'm personally navigating. BD at Patreon means convincing creators and partners that Patreon is the right home. I know how to make that case because I've had the same conversation with myself.`,
    metric: "Creator across content, apps, and tools — active, not theoretical",
  },
  {
    tag: "The Deal Architect",
    title: "I've structured deals at every stage — startup, mid-market, enterprise.",
    body: `At Vency Tech, I negotiated the exit — a 6× revenue multiple deal I structured and closed as a founder. At RGP, I closed a $745K national union platform deal, building the business case, running the commercial negotiation, and managing the partner relationship through signature. At TagTeam, every enterprise deal required deal structure design: licensing terms, integration scope, revenue share framing. Partnership structuring isn't a skill I'm developing at Patreon — it's something I'll bring to week one. The BD intern role here asks for someone who can "build business cases and evaluate deal structures." That's been my job description at every company I've worked at.`,
    metric: "6× exit at Vency Tech · $745K platform deal at RGP",
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

export default function PatreonStories() {
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
