import { compileMDX } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";

interface PostBodyProps {
  content: string;
}

export default async function PostBody({ content }: PostBodyProps) {
  const { content: rendered } = await compileMDX({
    source: content,
    options: {
      mdxOptions: {
        remarkPlugins: [remarkGfm],
        rehypePlugins: [rehypeHighlight],
      },
    },
  });

  return (
    <div className="prose prose-zinc prose-lg max-w-none prose-headings:font-serif prose-a:text-indigo-600 prose-code:text-indigo-700 prose-pre:bg-zinc-900">
      {rendered}
    </div>
  );
}
