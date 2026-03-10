import fs from "fs";
import path from "path";
import matter from "gray-matter";
import readingTime from "reading-time";
import type { Post, PostFrontmatter } from "@/types/post";

const POSTS_DIR = path.join(process.cwd(), "content/posts");

function getPostFiles(): string[] {
  const categories = ["ai", "mba-life", "music", "gtm-engineering"];
  const files: string[] = [];
  for (const cat of categories) {
    const dir = path.join(POSTS_DIR, cat);
    if (!fs.existsSync(dir)) continue;
    const mdxFiles = fs.readdirSync(dir).filter((f) => f.endsWith(".mdx"));
    for (const f of mdxFiles) {
      files.push(path.join(dir, f));
    }
  }
  return files;
}

function parsePost(filePath: string): Post | null {
  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);
  const fm = data as PostFrontmatter;

  const isDev = process.env.NODE_ENV === "development";
  if (!isDev && !fm.published) return null;

  const stats = readingTime(content);

  return {
    ...fm,
    content,
    readingTime: stats.text,
    filePath,
  };
}

export function getAllPosts(): Post[] {
  const files = getPostFiles();
  const posts = files.map(parsePost).filter((p): p is Post => p !== null);
  return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getPostBySlug(slug: string): Post | null {
  const files = getPostFiles();
  for (const filePath of files) {
    const raw = fs.readFileSync(filePath, "utf-8");
    const { data } = matter(raw);
    if (data.slug === slug) {
      return parsePost(filePath);
    }
  }
  return null;
}

export function getFeaturedPost(): Post | null {
  return getAllPosts()[0] ?? null;
}

export function getPostsByCategory(category: string): Post[] {
  return getAllPosts().filter((p) => p.category === category);
}

export function getPublishedSlugs(): string[] {
  const files = getPostFiles();
  const slugs: string[] = [];
  for (const filePath of files) {
    const raw = fs.readFileSync(filePath, "utf-8");
    const { data } = matter(raw);
    if (data.published) slugs.push(data.slug as string);
  }
  return slugs;
}
