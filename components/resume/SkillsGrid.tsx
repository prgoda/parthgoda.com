"use client";

import { useRef, useEffect, useState } from "react";
import type { ResumeSkill } from "@/lib/resume";

interface Props {
  skills: ResumeSkill[];
}

const CATEGORY_LABELS: Record<ResumeSkill["category"], string> = {
  technical: "Technical",
  business: "Business",
  creative: "Creative",
};

const CATEGORY_COLORS: Record<ResumeSkill["category"], string> = {
  technical: "bg-blue-500",
  business: "bg-zinc-800",
  creative: "bg-amber-500",
};

export default function SkillsGrid({ skills }: Props) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const categories = (["technical", "business", "creative"] as const).filter(
    (cat) => skills.some((s) => s.category === cat)
  );

  return (
    <div ref={ref} className="space-y-8">
      {categories.map((cat) => (
        <div key={cat}>
          <h3 className="text-xs font-semibold uppercase tracking-widest text-zinc-400 mb-4">
            {CATEGORY_LABELS[cat]}
          </h3>
          <div className="space-y-3">
            {skills
              .filter((s) => s.category === cat)
              .map((skill, i) => (
                <div key={skill.name}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-zinc-700 font-medium">{skill.name}</span>
                    <span className="text-zinc-400">{skill.level}%</span>
                  </div>
                  <div className="h-2 bg-zinc-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${CATEGORY_COLORS[cat]}`}
                      style={
                        isVisible
                          ? {
                              animation: `resume-bar-fill 0.8s ease-out ${i * 60}ms both`,
                              ["--bar-target-width" as string]: `${skill.level}%`,
                            }
                          : { width: 0 }
                      }
                    />
                  </div>
                </div>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
}
