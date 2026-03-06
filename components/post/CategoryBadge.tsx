import Link from "next/link";
import { getCategoryConfig } from "@/lib/categories";

interface CategoryBadgeProps {
  category: string;
  linked?: boolean;
}

export default function CategoryBadge({ category, linked = true }: CategoryBadgeProps) {
  const config = getCategoryConfig(category);
  if (!config) return null;

  const badge = (
    <span
      className={`inline-block px-2.5 py-0.5 text-xs font-semibold uppercase tracking-widest text-white rounded-sm ${config.bgColor}`}
    >
      {config.label}
    </span>
  );

  if (!linked) return badge;
  return <Link href={`/category/${category}`}>{badge}</Link>;
}
