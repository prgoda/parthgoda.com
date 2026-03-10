"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { label: "All", href: "/" },
  { label: "AI", href: "/category/ai" },
  { label: "MBA Life", href: "/category/mba-life" },
  { label: "Music", href: "/category/music" },
  { label: "Resume", href: "/resume" },
];

export default function Nav() {
  const pathname = usePathname();

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-zinc-200 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 flex items-center gap-1 overflow-x-auto">
        {NAV_ITEMS.map(({ label, href }) => {
          const isActive =
            href === "/" ? pathname === "/" : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`px-4 py-3 text-sm font-semibold uppercase tracking-widest whitespace-nowrap transition-colors border-b-2 ${
                isActive
                  ? "border-zinc-900 text-zinc-900"
                  : "border-transparent text-zinc-500 hover:text-zinc-900 hover:border-zinc-300"
              }`}
            >
              {label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
