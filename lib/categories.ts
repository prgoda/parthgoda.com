export type CategorySlug = "ai" | "mba-life" | "music" | "career";

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
    description: "Notes from business school, recruiting, strategy, and the MBA experience.",
  },
  music: {
    label: "Music",
    color: "emerald",
    bgColor: "bg-emerald-600",
    textColor: "text-emerald-700",
    description: "Music discovery, AI-generated audio, and the creative ownership debate.",
  },
  career: {
    label: "Career",
    color: "sky",
    bgColor: "bg-sky-600",
    textColor: "text-sky-700",
    description: "Career decisions and the building-in-public journey behind them: GTM engineering, 0-to-1 roles, and the throughlines I didn't see until later.",
  },
};

export function getCategoryConfig(slug: string): CategoryConfig | null {
  return CATEGORIES[slug as CategorySlug] ?? null;
}

export const ALL_CATEGORIES: CategorySlug[] = ["ai", "mba-life", "music", "career"];
