import type { Metadata } from "next";
import NetworkChrome from "@/components/network/NetworkChrome";

export const metadata: Metadata = {
  title: "Network",
  // Hidden means hidden: no indexing, no snippets, no link following.
  robots: { index: false, follow: false, nocache: true },
};

export const dynamic = "force-dynamic";

export default function NetworkLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900">
      <NetworkChrome />
      <main className="max-w-6xl mx-auto px-4 py-8">{children}</main>
    </div>
  );
}
