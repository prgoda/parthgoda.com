"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { lockAction } from "@/app/case-log/actions";

const ITEMS = [
  { label: "Dashboard", href: "/case-log" },
  { label: "Cases", href: "/case-log/cases" },
  { label: "Log", href: "/case-log/cases/new" },
];

export default function CaseLogChrome({ canWrite }: { canWrite: boolean }) {
  const pathname = usePathname();
  if (pathname === "/case-log/unlock") return null;

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-zinc-200">
      <div className="max-w-6xl mx-auto px-4 flex items-center gap-1">
        <Link
          href="/case-log"
          className="font-serif text-lg font-bold pr-5 py-3 whitespace-nowrap"
        >
          Case log
        </Link>

        {ITEMS.map(({ label, href }) => {
          // "Log" is a sub-path of "Cases", so the parent must not claim it.
          const isActive =
            href === "/case-log"
              ? pathname === "/case-log"
              : href === "/case-log/cases"
                ? pathname.startsWith(href) &&
                  !pathname.startsWith("/case-log/cases/new")
                : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`px-3 py-3 text-xs font-semibold uppercase tracking-widest transition-colors border-b-2 ${
                isActive
                  ? "border-zinc-900 text-zinc-900"
                  : "border-transparent text-zinc-500 hover:text-zinc-900"
              }`}
            >
              {label}
            </Link>
          );
        })}

        <div className="ml-auto flex items-center gap-3">
          <Link
            href="/"
            className="text-xs text-zinc-400 hover:text-zinc-700 transition-colors"
          >
            Back to site
          </Link>
          {canWrite ? (
            <form action={lockAction}>
              <button
                type="submit"
                title="Lock writing again"
                className="text-xs text-zinc-400 hover:text-zinc-700 transition-colors"
              >
                Lock
              </button>
            </form>
          ) : (
            <Link
              href="/case-log/unlock"
              className="text-xs text-zinc-400 hover:text-zinc-700 transition-colors"
            >
              Unlock
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
