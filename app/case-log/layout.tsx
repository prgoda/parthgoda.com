import type { Metadata } from "next";
import CaseLogChrome from "@/components/case-log/CaseLogChrome";

export const metadata: Metadata = {
  title: "Case log",
  // Private practice notes with other people's names in them. Not for crawlers.
  robots: { index: false, follow: false, nocache: true },
};

export const dynamic = "force-dynamic";

export default function CaseLogLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900">
      <CaseLogChrome />
      <main className="max-w-6xl mx-auto px-4 py-8">{children}</main>
    </div>
  );
}
