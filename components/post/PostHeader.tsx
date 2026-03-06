import { format, parseISO } from "date-fns";
import type { Post } from "@/types/post";
import CategoryBadge from "./CategoryBadge";

interface PostHeaderProps {
  post: Post;
}

export default function PostHeader({ post }: PostHeaderProps) {
  const isDraft = !post.published;

  return (
    <header className="mb-10">
      {isDraft && (
        <div className="mb-6 px-4 py-3 bg-red-50 border border-red-200 rounded text-red-800 text-sm font-semibold uppercase tracking-widest text-center">
          Draft — Not Published
        </div>
      )}

      <div className="flex items-center gap-3 mb-5">
        <CategoryBadge category={post.category} />
        {post.tags.map((tag) => (
          <span key={tag} className="text-xs text-zinc-400 uppercase tracking-wider">
            #{tag}
          </span>
        ))}
      </div>

      <h1 className="font-serif text-4xl md:text-5xl font-bold leading-tight mb-6">
        {post.title}
      </h1>

      <p className="text-lg text-zinc-600 mb-6 leading-relaxed">{post.excerpt}</p>

      <div className="flex items-center gap-3 text-sm text-zinc-500 border-t border-b border-zinc-200 py-4">
        <span className="font-medium text-zinc-800">{post.author}</span>
        <span>·</span>
        <time dateTime={post.date}>{format(parseISO(post.date), "MMMM d, yyyy")}</time>
        <span>·</span>
        <span>{post.readingTime}</span>
        {post.aiGenerated && (
          <>
            <span>·</span>
            <span className="text-indigo-500">AI-assisted draft</span>
          </>
        )}
      </div>
    </header>
  );
}
