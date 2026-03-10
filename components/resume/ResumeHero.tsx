"use client";

import { useEffect, useState } from "react";
import type { ResumeData } from "@/lib/resume";

interface Props {
  data: Pick<ResumeData, "name" | "title" | "tagline" | "email" | "linkedin" | "github">;
}

function useTypewriter(text: string, speed = 45) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    setDisplayed("");
    setDone(false);
    let i = 0;
    const id = setInterval(() => {
      i++;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) {
        clearInterval(id);
        setDone(true);
      }
    }, speed);
    return () => clearInterval(id);
  }, [text, speed]);

  return { displayed, done };
}

export default function ResumeHero({ data }: Props) {
  const { displayed, done } = useTypewriter(data.title, 45);
  const [nameVisible, setNameVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setNameVisible(true), 100);
    return () => clearTimeout(t);
  }, []);

  return (
    <header className="py-16 md:py-24 text-center border-b border-zinc-200">
      <h1
        className={`font-serif text-4xl md:text-6xl font-bold tracking-tight mb-4 transition-opacity duration-700 ${
          nameVisible ? "opacity-100" : "opacity-0"
        }`}
      >
        {data.name}
      </h1>

      <p className="text-xl md:text-2xl text-zinc-600 font-mono min-h-[2rem] mb-2">
        {displayed}
        {!done && <span className="resume-cursor">|</span>}
      </p>

      <p
        className={`text-base md:text-lg text-zinc-500 max-w-xl mx-auto mt-4 transition-opacity duration-700 ${
          done ? "opacity-100" : "opacity-0"
        }`}
      >
        {data.tagline}
      </p>

      <div className="flex items-center justify-center gap-6 mt-8 text-sm text-zinc-600">
        <a href={`mailto:${data.email}`} className="hover:text-zinc-900 underline underline-offset-4">
          {data.email}
        </a>
        <a href={data.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-zinc-900 underline underline-offset-4">
          LinkedIn
        </a>
        {data.github && (
          <a href={data.github} target="_blank" rel="noopener noreferrer" className="hover:text-zinc-900 underline underline-offset-4">
            GitHub
          </a>
        )}
      </div>
    </header>
  );
}
