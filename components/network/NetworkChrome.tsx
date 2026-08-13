"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { logoutAction } from "@/app/network/actions";

const ITEMS = [
  { label: "Dashboard", href: "/network" },
  { label: "People", href: "/network/people" },
  { label: "Add", href: "/network/people/new" },
];

export default function NetworkChrome() {
  const pathname = usePathname();
  if (pathname === "/network/login") return null;

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-zinc-200">
      <div className="max-w-6xl mx-auto px-4 flex items-center gap-1">
        <Link
          href="/network"
          className="font-serif text-lg font-bold pr-5 py-3 whitespace-nowrap"
        >
          Keep in touch
        </Link>

        {ITEMS.map(({ label, href }) => {
          const isActive =
            href === "/network"
              ? pathname === "/network"
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
          <form action={logoutAction}>
            <button
              type="submit"
              className="text-xs text-zinc-400 hover:text-zinc-700 transition-colors"
            >
              Lock
            </button>
          </form>
        </div>
      </div>
    </header>
  );
}
