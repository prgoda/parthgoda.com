export type CategorySlug = "ai" | "mba-life" | "music";

export interface CategoryConfig {
  label: string;
  color: string;
  bgColor: string;
  textColor: string;
  description: string;
}

export const CATEGORIES: Record<CategorySlug, CategoryConfig> = {
  ai: {
    label: "AI",
    color: "indigo",
    bgColor: "bg-indigo-600",
    textColor: "text-indigo-700",
    description: "Exploring artificial intelligence, large language models, and the reasoning era.",
  },
  "mba-life": {
    label: "MBA Life",
    color: "amber",
    bgColor: "bg-amber-500",
    textColor: "text-amber-700",
    description: "Notes from business school — recruiting, strategy, and the MBA experience.",
  },
  music: {
    label: "Music",
    color: "emerald",
    bgColor: "bg-emerald-600",
    textColor: "text-emerald-700",
    description: "Music discovery, AI-generated audio, and the creative ownership debate.",
  },
};

export function getCategoryConfig(slug: string): CategoryConfig | null {
  return CATEGORIES[slug as CategorySlug] ?? null;
}

export const ALL_CATEGORIES: CategorySlug[] = ["ai", "mba-life", "music"];
