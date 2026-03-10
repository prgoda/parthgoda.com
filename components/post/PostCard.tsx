import Link from "next/link";
import { format, parseISO } from "date-fns";
import type { Post } from "@/types/post";
import CategoryBadge from "./CategoryBadge";

interface PostCardProps {
  post: Post;
}

export default function PostCard({ post }: PostCardProps) {
  const isDraft = !post.published;

  return (
    <article className="group flex flex-col">
      {post.coverImage && (
        <Link href={`/posts/${post.slug}`} className="block overflow-hidden rounded-sm mb-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={post.coverImage}
            alt={post.title}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </Link>
      )}

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
