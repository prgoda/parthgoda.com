"use client";

import { useRef, useEffect, useState } from "react";

export default function PatreonWhy() {
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
        Why Patreon
      </h2>

      <div
        className={`space-y-5 resume-slide-up ${visible ? "is-visible" : ""}`}
        style={{ transitionDelay: "80ms" }}
      >
        <p className="text-zinc-700 leading-relaxed">
          Patreon's mission is to fund the creative class. That's not a tagline
          I read in the job posting — it's the reason I applied. I run a content
          site, build apps, and make short-form content. I know what it feels
          like to try to turn creative work into sustainable income. The
          platform infrastructure that Patreon builds is the same infrastructure
          I depend on.
        </p>

        <p className="text-zinc-700 leading-relaxed">
          Most BD candidates will come in having analyzed the creator economy.
          I'm coming in having lived it. That changes the quality of the
          conversations I'll have with creator partners — because I understand
          their actual problem, not just the market dynamics around it.
        </p>

        <p className="text-zinc-700 leading-relaxed">
          And Patreon is at a genuinely interesting inflection point. The
          creator economy is maturing, AI is reshaping what it costs to produce
          content, and the platforms that win will be the ones that help
          creators build durable revenue — not just audiences. BD is where
          Patreon decides which partnerships move that needle. That's where I
          want to be.
        </p>

        <blockquote className="border-l-2 border-zinc-300 pl-5 py-1">
          <p className="text-zinc-500 italic text-sm leading-relaxed">
            "Patreon exists to fund the creative class — to help creators earn
            a sustainable income doing what they love."
          </p>
          <p className="text-xs text-zinc-400 mt-2">— Patreon, on mission</p>
        </blockquote>

        <p className="text-zinc-700 leading-relaxed">
          I'm at Kellogg studying Strategy and AI specifically because I want
          to operate at the intersection of platform thinking and commercial
          execution. The Patreon BD internship is the right place to do that
          work — with real deal flow, real partners, and a mission I actually
          believe in.
        </p>
      </div>
    </section>
  );
}
