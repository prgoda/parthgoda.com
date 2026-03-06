#!/usr/bin/env tsx
import Anthropic from "@anthropic-ai/sdk";
import matter from "gray-matter";
import fs from "fs";
import path from "path";

function getArg(flag: string): string | undefined {
  const idx = process.argv.indexOf(flag);
  return idx !== -1 ? process.argv[idx + 1] : undefined;
}

const VALID_CATEGORIES = ["ai", "mba-life", "music"] as const;
type Category = (typeof VALID_CATEGORIES)[number];

const CATEGORY_LABELS: Record<Category, string> = {
  ai: "AI",
  "mba-life": "MBA Life",
  music: "Music",
};

function isValidCategory(s: string): s is Category {
  return (VALID_CATEGORIES as readonly string[]).includes(s);
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 60);
}

async function main() {
  const categoryRaw = getArg("--category");
  const topic = getArg("--topic");
  const context = getArg("--context") ?? "";
  const customSlug = getArg("--slug");

  if (!categoryRaw || !topic) {
    console.error(
      "Usage: npm run generate -- --category <ai|mba-life|music> --topic <topic>"
    );
    process.exit(1);
  }

  if (!isValidCategory(categoryRaw)) {
    console.error(
      `Invalid category: "${categoryRaw}". Must be one of: ${VALID_CATEGORIES.join(", ")}`
    );
    process.exit(1);
  }

  const category: Category = categoryRaw;
  const today = new Date().toISOString().split("T")[0];

  const SYSTEM_PROMPT = `You are the editorial voice of Parth Goda — a sharp, intellectually honest writer covering AI, business school life, and music. Your writing is:

- Substantive: every paragraph earns its place
- Opinionated but fair: take a position, acknowledge the other side
- Specific: use concrete examples, not vague generalities
- Accessible: write for a smart general reader, not an expert audience
- Concise: no filler, no throat-clearing, no summaries that restate what was already said

You will produce a complete MDX blog post. It must begin with YAML frontmatter:
---
title: "..."
slug: "..."
date: "${today}"
category: "${category}"
excerpt: "..."
author: "Parth Goda"
coverImage: ""
tags: [...]
published: false
aiGenerated: true
---

Then the post body in MDX/Markdown. Aim for 600–900 words. Use ## and ### headings. Include at least 3 sections. Write in first person where natural.

Rules:
- slug must be kebab-case derived from the title
- excerpt: 1–2 sentences for card preview
- tags: YAML array of 2–5 lowercase strings
- Do NOT include a top-level # heading
- Do NOT include a conclusion that merely summarizes — end with your sharpest observation
- Write the full post without truncating`;

  const USER_PROMPT = `Category: ${CATEGORY_LABELS[category]}
Topic: ${topic}
${context ? `Additional context: ${context}` : ""}

Write the complete MDX post now.`;

  const client = new Anthropic();

  console.log(
    `\nGenerating "${CATEGORY_LABELS[category]}" post on: "${topic}"...\n`
  );

  let fullResponse = "";

  const stream = client.messages.stream({
    model: "claude-sonnet-4-6",
    max_tokens: 2000,
    system: SYSTEM_PROMPT,
    messages: [{ role: "user", content: USER_PROMPT }],
  });

  for await (const event of stream) {
    if (
      event.type === "content_block_delta" &&
      event.delta.type === "text_delta"
    ) {
      process.stdout.write(event.delta.text);
      fullResponse += event.delta.text;
    }
  }

  await stream.finalMessage();
  console.log("\n");

  // Validate frontmatter
  let title: string;
  try {
    const { data } = matter(fullResponse);
    title = String(data.title ?? topic);
  } catch {
    console.error("Failed to parse frontmatter from generated content.");
    process.exit(1);
  }

  const slug = customSlug ?? slugify(title);
  if (!slug) {
    console.error("Could not derive a slug from the title.");
    process.exit(1);
  }

  // Ensure the slug in the content matches our derived slug
  const finalContent = fullResponse.replace(
    /^slug:\s*".*?"/m,
    `slug: "${slug}"`
  );

  const outDir = path.join(process.cwd(), "content", "posts", category);
  fs.mkdirSync(outDir, { recursive: true });

  const outPath = path.join(outDir, `${slug}.mdx`);
  fs.writeFileSync(outPath, finalContent, "utf-8");

  console.log(`\nDraft created: content/posts/${category}/${slug}.mdx`);
  console.log(`Flip \`published: false\` → \`published: true\` to publish.\n`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
