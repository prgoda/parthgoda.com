export interface PostFrontmatter {
  title: string;
  slug: string;
  date: string;
  category: "ai" | "mba-life" | "music";
  excerpt: string;
  author: string;
  coverImage?: string;
  tags: string[];
  published: boolean;
  aiGenerated: boolean;
}

export interface Post extends PostFrontmatter {
  content: string;
  readingTime: string;
  filePath: string;
}
