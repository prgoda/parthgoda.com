import Link from "next/link";
import type { Post } from "@/types/post";
import CategoryBadge from "@/components/post/CategoryBadge";
import { format, parseISO } from "date-fns";

interface HeroPostProps {
  post: Post;
}

export default function HeroPost({ post }: HeroPostProps) {
  const isDraft = !post.published;

  return (
    <article className="mb-16">
      {post.coverImage && (
        <Link href={`/posts/${post.slug}`} className="block overflow-hidden mb-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={post.coverImage}
            alt={post.title}
            className="w-full h-72 object-cover hover:scale-105 transition-transform duration-500"
          />
        </Link>
      )}

      {/* Content */}
      <div className="flex flex-col justify-center px-8 py-10 bg-zinc-50 border border-zinc-200">
        <div className="flex items-center gap-3 mb-4">
          <CategoryBadge category={post.category} />
          {isDraft && (
            <span className="px-2 py-0.5 text-xs font-bold uppercase tracking-widest text-red-700 bg-red-100 rounded-sm">
              Draft
            </span>
          )}
          <span className="text-xs text-zinc-400 uppercase tracking-widest">Featured</span>
        </div>

        <Link href={`/posts/${post.slug}`}>
          <h1 className="font-serif text-4xl md:text-5xl font-bold leading-tight mb-5 hover:text-indigo-600 transition-colors">
            {post.title}
          </h1>
        </Link>

        <p className="text-zinc-600 text-lg leading-relaxed mb-6">{post.excerpt}</p>

        <div className="flex items-center gap-3 text-sm text-zinc-500 mb-6">
          <span className="font-medium text-zinc-800">{post.author}</span>
          <span>·</span>
          <time dateTime={post.date}>{format(parseISO(post.date), "MMMM d, yyyy")}</time>
          <span>·</span>
          <span>{post.readingTime}</span>
        </div>

        <Link
          href={`/posts/${post.slug}`}
          className="self-start px-5 py-2.5 bg-zinc-900 text-white text-sm font-semibold uppercase tracking-wider hover:bg-zinc-700 transition-colors"
        >
          Read Story →
        </Link>
      </div>
    </article>
  );
}

