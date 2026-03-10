import type { Metadata } from "next";
import PitchHero from "@/components/safetywing/PitchHero";
import PitchMatch from "@/components/safetywing/PitchMatch";
import PitchStories from "@/components/safetywing/PitchStories";
import PitchWhy from "@/components/safetywing/PitchWhy";
import PitchCTA from "@/components/safetywing/PitchCTA";

export const metadata: Metadata = {
  title: "Parth Goda × SafetyWing — PM Intern",
  description:
    "Why Parth Goda is the right Product Manager Intern for SafetyWing's Platforms team.",
  robots: { index: false },
};

export default function SafetyWingPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 pb-24">
      <PitchHero />
      <PitchMatch />
      <PitchStories />
      <PitchWhy />
      <PitchCTA />
    </main>
  );
}
