"use client";

import { useRef, useEffect, useState, ReactNode } from "react";

interface Props {
  title: string;
  children: ReactNode;
  animationDelay?: number;
}

export default function ResumeSection({ title, children, animationDelay = 0 }: Props) {
  const ref = useRef<HTMLElement | null>(null);
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

  return (
    <section
      ref={ref as React.RefObject<HTMLElement>}
      className={`resume-slide-up py-12 border-b border-zinc-100 last:border-0 ${isVisible ? "is-visible" : ""}`}
      style={{ animationDelay: `${animationDelay}ms` }}
    >
      <h2 className="font-serif text-2xl font-bold mb-8 text-zinc-900 uppercase tracking-widest text-sm">
        {title}
      </h2>
      {children}
    </section>
  );
}
