import type { Metadata } from "next";
import PatreonHero from "@/components/patreon/PatreonHero";
import PatreonMatch from "@/components/patreon/PatreonMatch";
import PatreonStories from "@/components/patreon/PatreonStories";
import PatreonWhy from "@/components/patreon/PatreonWhy";
import PatreonCTA from "@/components/patreon/PatreonCTA";

export const metadata: Metadata = {
  title: "Parth Goda × Patreon — BD Intern",
  description:
    "Why Parth Goda is the right Business Development Intern for Patreon.",
  robots: { index: false },
};

export default function PatreonPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 pb-24">
      <PatreonHero />
      <PatreonMatch />
      <PatreonStories />
      <PatreonWhy />
      <PatreonCTA />
    </main>
  );
}
