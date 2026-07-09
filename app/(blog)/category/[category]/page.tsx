import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getPostsByCategory } from "@/lib/posts";
import { getCategoryConfig, ALL_CATEGORIES } from "@/lib/categories";
import PostGrid from "@/components/home/PostGrid";

interface PageProps {
  params: Promise<{ category: string }>;
}

export async function generateStaticParams() {
  return ALL_CATEGORIES.map((category) => ({ category }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { category } = await params;
  const config = getCategoryConfig(category);
  if (!config) return {};
  return {
    title: config.label,
    description: config.description,
  };
}

export default async function CategoryPage({ params }: PageProps) {
  const { category } = await params;
  const config = getCategoryConfig(category);
  if (!config) notFound();

  const posts = getPostsByCategory(category);

  return (
    <div>
      <div className="mb-10">
        <span
          className={`inline-block px-3 py-1 text-xs font-bold uppercase tracking-widest text-white rounded-sm mb-4 ${config.bgColor}`}
        >
          {config.label}
        </span>
        <h1 className="font-serif text-4xl font-bold text-zinc-900 mb-3">{config.label}</h1>
        <p className="text-zinc-500 text-lg">{config.description}</p>
      </div>
      <PostGrid posts={posts} />
    </div>
  );
}
