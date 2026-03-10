"use client";

import { useRef, useEffect, useState } from "react";

export default function PitchWhy() {
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
      { threshold: 0.15 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section ref={ref} className="py-12 border-b border-zinc-100">
      <h2
        className={`font-serif text-2xl font-bold mb-6 resume-slide-up ${
          visible ? "is-visible" : ""
        }`}
      >
        Why SafetyWing
      </h2>

      <div
        className={`space-y-5 resume-slide-up ${visible ? "is-visible" : ""}`}
        style={{ transitionDelay: "80ms" }}
      >
        <p className="text-zinc-700 leading-relaxed">
          SafetyWing is building the safety net for a world where work is
          untethered from geography. I've lived that world. My career started in
          Singapore, scaled across Asia-Pacific, and is now based out of
          Kellogg. Every client I've ever served has had distributed teams
          navigating the complexity of cross-border employment, health coverage,
          and compliance.
        </p>

        <p className="text-zinc-700 leading-relaxed">
          The people SafetyWing protects aren't abstract users to me — they're
          the same engineers, consultants, and founders I've worked alongside.
          That's not a line I'm writing because it sounds good. It's the actual
          reason this role caught my attention.
        </p>

        <p className="text-zinc-700 leading-relaxed">
          And operationally: I don't need to be onboarded to async-first work.
          Managing partners across Singapore, Japan, Korea, and Indonesia on
          overlapping deadlines taught me how to run distributed product work
          well before remote-first became a trend.
        </p>

        <blockquote className="border-l-2 border-zinc-300 pl-5 py-1">
          <p className="text-zinc-500 italic text-sm leading-relaxed">
            "We want people who think independently, embrace calculated
            risk-taking, demonstrate intellectual curiosity, and do the right
            thing."
          </p>
          <p className="text-xs text-zinc-400 mt-2">— SafetyWing, on the qualities they seek</p>
        </blockquote>

        <p className="text-zinc-700 leading-relaxed">
          I founded a company as a student, exited it, joined a seed-stage
          startup, scaled it, then went into consulting to sharpen the
          enterprise muscle. Now I'm at Kellogg deliberately — to add
          strategic rigor to an operator background. SafetyWing's Platforms
          internship is where those threads converge.
        </p>
      </div>
    </section>
  );
}
