import Link from "next/link";
import { format, parseISO } from "date-fns";
import type { Post } from "@/types/post";
import CategoryBadge from "./CategoryBadge";
import { getCategoryConfig } from "@/lib/categories";

interface PostCardProps {
  post: Post;
}

const GRADIENT_COLORS: Record<string, string> = {
  ai: "from-indigo-500 to-indigo-700",
  "mba-life": "from-amber-400 to-amber-600",
  music: "from-emerald-500 to-emerald-700",
};

export default function PostCard({ post }: PostCardProps) {
  const gradient = GRADIENT_COLORS[post.category] ?? "from-zinc-400 to-zinc-600";
  const isDraft = !post.published;

  return (
    <article className="group flex flex-col">
      <Link href={`/posts/${post.slug}`} className="block overflow-hidden rounded-sm mb-4">
        {post.coverImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={post.coverImage}
            alt={post.title}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div
            className={`w-full h-48 bg-gradient-to-br ${gradient} group-hover:scale-105 transition-transform duration-300`}
          />
        )}
      </Link>

      <div className="flex items-center gap-2 mb-2">
        <CategoryBadge category={post.category} />
        {isDraft && (
          <span className="inline-block px-2 py-0.5 text-xs font-bold uppercase tracking-widest text-red-700 bg-red-100 rounded-sm">
            Draft
          </span>
        )}
      </div>

      <Link href={`/posts/${post.slug}`}>
        <h2 className="font-serif text-xl font-bold leading-snug mb-2 group-hover:text-indigo-600 transition-colors">
          {post.title}
        </h2>
      </Link>

      <p className="text-zinc-600 text-sm leading-relaxed mb-3 line-clamp-3">{post.excerpt}</p>

      <div className="flex items-center gap-2 text-xs text-zinc-400 mt-auto">
        <span>{post.author}</span>
        <span>·</span>
        <time dateTime={post.date}>{format(parseISO(post.date), "MMM d, yyyy")}</time>
        <span>·</span>
        <span>{post.readingTime}</span>
      </div>
    </article>
  );
}
