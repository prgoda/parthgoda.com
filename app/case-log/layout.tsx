import type { Metadata } from "next";
import CaseLogChrome from "@/components/case-log/CaseLogChrome";
import { Card } from "@/components/case-log/ui";
import { storageConfigured } from "@/lib/case-log/db";
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
  const ready = storageConfigured();

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900">
      <CaseLogChrome canWrite={writable} />
      <main className="max-w-6xl mx-auto px-4 py-8">
        {ready ? (
          children
        ) : (
          // Every page below reads the database, so there is nothing any of
          // them could render. Say why rather than throwing a 500 at readers.
          <Card className="mx-auto max-w-lg p-8 text-center">
            <h1 className="font-serif text-2xl font-bold text-zinc-900">
              The log is not connected yet
            </h1>
            <p className="mt-2 text-sm text-zinc-600 leading-relaxed">
              This deploy has no database behind it, so there are no cases to
              show. Nothing is broken on your end — check back shortly.
            </p>
            <p className="mt-4 text-xs text-zinc-400 leading-relaxed">
              Set <code className="rounded bg-zinc-100 px-1.5 py-0.5">TURSO_DATABASE_URL</code>{" "}
              and <code className="rounded bg-zinc-100 px-1.5 py-0.5">TURSO_AUTH_TOKEN</code>{" "}
              to point it at hosted storage.
            </p>
          </Card>
        )}
      </main>
    </div>
  );
}
