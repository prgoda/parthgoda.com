import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getAllPosts, getPostBySlug, getPublishedSlugs } from "@/lib/posts";
import PostHeader from "@/components/post/PostHeader";
import PostBody from "@/components/post/PostBody";
import Link from "next/link";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = getPublishedSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      publishedTime: post.date,
      authors: [post.author],
    },
  };
}

export default async function PostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) notFound();

  return (
    <article className="max-w-3xl mx-auto">
      <PostHeader post={post} />
      <PostBody content={post.content} />
      <div className="mt-16 pt-8 border-t border-zinc-200">
        <Link
          href="/"
          className="text-sm font-semibold uppercase tracking-widest text-zinc-500 hover:text-zinc-900 transition-colors"
        >
          ← Back to all posts
        </Link>
      </div>
    </article>
  );
}
