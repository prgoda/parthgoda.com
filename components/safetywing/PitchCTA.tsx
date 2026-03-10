"use client";

import { useRef, useEffect, useState } from "react";

export default function PitchCTA() {
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
      { threshold: 0.2 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section ref={ref} className="py-14 text-center">
      <div
        className={`resume-slide-up ${visible ? "is-visible" : ""}`}
      >
        <p className="font-serif text-3xl font-bold text-zinc-900 mb-3">
          Let's talk.
        </p>
        <p className="text-zinc-500 text-sm mb-8 max-w-sm mx-auto leading-relaxed">
          I'm available to start April 1, 2026 and fully committed to a
          six-month engagement. Happy to chat about Platforms, integrations, or
          anything else.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <a
            href="mailto:prgoda@gmail.com"
            className="inline-block px-6 py-3 bg-zinc-900 text-white text-sm font-semibold rounded-lg hover:bg-zinc-700 transition-colors"
          >
            prgoda@gmail.com
          </a>
          <a
            href="https://linkedin.com/in/parthgoda"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-6 py-3 border border-zinc-300 text-zinc-700 text-sm font-semibold rounded-lg hover:border-zinc-600 hover:text-zinc-900 transition-colors"
          >
            LinkedIn ↗
          </a>
          <a
            href="/Parth_Goda_Resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-6 py-3 border border-zinc-300 text-zinc-700 text-sm font-semibold rounded-lg hover:border-zinc-600 hover:text-zinc-900 transition-colors"
          >
            Resume PDF ↗
          </a>
        </div>

        <p className="mt-10 text-xs text-zinc-300 uppercase tracking-widest">
          Parth Goda · Kellogg MBA 2027 · Northwestern University
        </p>
      </div>
    </section>
  );
}
