"use client";

import { useEffect, useState } from "react";

export default function FormlabsHero() {
  const [visible, setVisible] = useState(false);
  useEffect(() => { setTimeout(() => setVisible(true), 80); }, []);

  return (
    <header className="pt-14 pb-16 border-b border-zinc-200">
      <div className={`transition-all duration-500 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"}`}>
        <div className="flex items-center gap-3 mb-8">
          <span className="text-xs font-semibold uppercase tracking-widest text-zinc-400">GTM Strategy · Interview Preparation</span>
          <span className="text-zinc-200">·</span>
          <span className="text-xs font-semibold uppercase tracking-widest text-zinc-400">Formlabs</span>
        </div>

        <h1 className="font-serif text-4xl md:text-5xl font-bold leading-tight tracking-tight mb-4">
          Doubling the<br />
          <span className="text-zinc-400">Service Attach Rate</span>
        </h1>

        <p className="text-zinc-500 text-lg mb-10">
          A 9-month roadmap to take attach rate from 30% → 60% across Direct, Reseller, and Web Store channels.
        </p>

        {/* 30 → 60 metric */}
        <div className="grid grid-cols-2 gap-0 max-w-xs border border-zinc-200 rounded-lg overflow-hidden">
          <div className="bg-zinc-50 px-6 py-5 text-center border-r border-zinc-200">
            <p className="text-xs font-semibold uppercase tracking-widest text-zinc-400 mb-1">Now</p>
            <p className="font-serif text-4xl font-bold text-zinc-900">30%</p>
            <p className="text-xs text-zinc-400 mt-1">Attach Rate</p>
          </div>
          <div className="bg-zinc-900 px-6 py-5 text-center">
            <p className="text-xs font-semibold uppercase tracking-widest text-orange-400 mb-1">Target</p>
            <p className="font-serif text-4xl font-bold text-orange-500">60%</p>
            <p className="text-xs text-zinc-400 mt-1">9 months</p>
          </div>
        </div>

        <div className="mt-8">
          <a
            href="/formlabs-service-attach-strategy.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 border border-zinc-300 text-sm font-medium text-zinc-600 rounded-lg hover:border-zinc-500 hover:text-zinc-900 transition-colors"
          >
            Download full deck PDF ↗
          </a>
        </div>
      </div>
    </header>
  );
}
