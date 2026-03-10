"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

export default function PitchHero() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 80);
    return () => clearTimeout(t);
  }, []);

  return (
    <header className="pt-14 pb-16 border-b border-zinc-200">
      {/* Eyebrow */}
      <div
        className={`flex items-center gap-3 mb-8 transition-opacity duration-500 ${
          visible ? "opacity-100" : "opacity-0"
        }`}
      >
        <span className="text-xs font-semibold uppercase tracking-widest text-zinc-400">
          Product Manager Intern Application
        </span>
        <span className="text-zinc-200">·</span>
        <span className="text-xs font-semibold uppercase tracking-widest text-zinc-400">
          SafetyWing · April 2026
        </span>
      </div>

      {/* Headline */}
      <h1
        className={`font-serif text-4xl md:text-5xl font-bold leading-tight tracking-tight mb-5 transition-all duration-700 delay-100 ${
          visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        }`}
      >
        Built for
        <br />
        <span className="text-zinc-400">SafetyWing</span> Platforms.
      </h1>

      <p
        className={`text-lg md:text-xl text-zinc-600 leading-relaxed max-w-2xl mb-8 transition-all duration-700 delay-200 ${
          visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        }`}
      >
        I've spent five years building integrations, owning cross-functional
        roadmaps, and shipping products from zero. Here's the case that I'm the
        right PM intern for your Platforms team.
      </p>

      {/* Quick stats */}
      <div
        className={`grid grid-cols-3 gap-4 transition-all duration-700 delay-300 ${
          visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        }`}
      >
        {[
          { stat: "5+", label: "Years shipping product" },
          { stat: "$8M", label: "AI practice launched" },
          { stat: "6×", label: "SaaS exit multiple" },
        ].map(({ stat, label }) => (
          <div
            key={stat}
            className="border border-zinc-200 rounded-lg p-4 text-center"
          >
            <p className="font-serif text-2xl font-bold text-zinc-900">{stat}</p>
            <p className="text-xs text-zinc-500 mt-1 leading-snug">{label}</p>
          </div>
        ))}
      </div>
    </header>
  );
}
