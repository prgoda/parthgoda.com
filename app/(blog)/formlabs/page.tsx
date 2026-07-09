import type { Metadata } from "next";
import FormlabsHero from "@/components/formlabs/FormlabsHero";
import FormlabsData from "@/components/formlabs/FormlabsData";
import FormlabsGaps from "@/components/formlabs/FormlabsGaps";
import FormlabsStrategy from "@/components/formlabs/FormlabsStrategy";
import FormlabsRoadmap from "@/components/formlabs/FormlabsRoadmap";
import FormlabsPlaybooks from "@/components/formlabs/FormlabsPlaybooks";
import FormlabsMeasure from "@/components/formlabs/FormlabsMeasure";
import FormlabsClose from "@/components/formlabs/FormlabsClose";

export const metadata: Metadata = {
  title: "Doubling the Service Attach Rate — Formlabs GTM Strategy",
  description:
    "A 9-month roadmap to take Formlabs service attach rate from 30% to 60% across Direct, Reseller, and Web Store channels.",
  robots: { index: false },
};

export default function FormlabsPage() {
  return (
    <main className="max-w-4xl mx-auto px-4 pb-24">
      <FormlabsHero />
      <FormlabsData />
      <FormlabsGaps />
      <FormlabsStrategy />
      <FormlabsRoadmap />
      <FormlabsPlaybooks />
      <FormlabsMeasure />
      <FormlabsClose />
    </main>
  );
}
