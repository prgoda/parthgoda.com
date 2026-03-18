"use client";

import { useRef, useEffect, useState } from "react";

const channelData = [
  { label: "Reseller", value: 31, color: "bg-amber-500" },
  { label: "Sales Rep", value: 58, color: "bg-emerald-500" },
  { label: "Web Store", value: 24, color: "bg-red-500" },
];

const regionData = [
  { label: "AMER", value: 52, color: "bg-emerald-500" },
  { label: "EMEA", value: 40, color: "bg-amber-500" },
  { label: "APAC", value: 3, color: "bg-red-500" },
];

function BarChart({ title, data, animate }: { title: string; data: typeof channelData; animate: boolean }) {
  return (
    <div>
      <p className="text-sm font-semibold text-zinc-700 mb-4">{title}</p>
      <div className="space-y-3">
        {data.map((d) => (
          <div key={d.label}>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-zinc-600">{d.label}</span>
              <span className="font-semibold text-zinc-800">{d.value}%</span>
            </div>
            <div className="h-5 bg-zinc-100 rounded overflow-hidden">
              <div
                className={`h-full rounded ${d.color} transition-all duration-700 ease-out`}
                style={{ width: animate ? `${d.value}%` : "0%" }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function FormlabsData() {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); obs.unobserve(el); } }, { threshold: 0.2 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section ref={ref} className={`py-12 border-b border-zinc-100 resume-slide-up ${visible ? "is-visible" : ""}`}>
      <h2 className="font-serif text-2xl font-bold mb-2">Where We Stand Today</h2>
      <p className="text-zinc-500 text-sm mb-8">
        Attach Rate = Service Plans Sold ÷ Printers Sold, by channel or region.
      </p>
      <div className="grid md:grid-cols-2 gap-10">
        <BarChart title="Attach Rate by Channel" data={channelData} animate={visible} />
        <BarChart title="Attach Rate by Region" data={regionData} animate={visible} />
      </div>
    </section>
  );
}
