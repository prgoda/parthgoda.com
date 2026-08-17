import type { Metadata } from "next";
import CaseLogChrome from "@/components/case-log/CaseLogChrome";
import { canWrite } from "@/lib/case-log/session";

export const metadata: Metadata = {
  title: "Case log",
  description:
    "Every consulting case I have practiced, scored on the five things partners actually grade.",
};

export const dynamic = "force-dynamic";

export default async function CaseLogLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  // Read once here and thread it down, so nothing below needs the cookie jar.
  const writable = await canWrite();

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900">
      <CaseLogChrome canWrite={writable} />
      <main className="max-w-6xl mx-auto px-4 py-8">{children}</main>
    </div>
  );
}
