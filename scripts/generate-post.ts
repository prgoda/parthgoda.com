#!/usr/bin/env tsx
import Anthropic from "@anthropic-ai/sdk";
import { GoogleGenAI } from "@google/genai";
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

const IMAGE_STYLE: Record<Category, string> = {
  ai: "futuristic tech, neural networks, glowing circuits, deep indigo and violet tones, editorial magazine photography style",
  "mba-life": "business school campus, professionals networking, warm amber tones, editorial magazine photography style",
  music: "abstract sound waves, concert lighting, instruments, emerald and teal tones, editorial magazine photography style",
};

async function generateCoverImage(
  title: string,
  excerpt: string,
  category: Category,
  slug: string
): Promise<string> {
  const apiKey = process.env.GOOGLE_API_KEY;
  if (!apiKey) {
    console.log("No GOOGLE_API_KEY found — skipping image generation.");
    return "";
  }

  console.log("Generating cover image with Imagen...");

  const ai = new GoogleGenAI({ apiKey });
  const prompt = `Editorial magazine cover photo for an article titled "${title}". ${excerpt} Visual style: ${IMAGE_STYLE[category]}. No text, no words, no letters in the image. High quality, professional photography.`;

  const response = await ai.models.generateImages({
    model: "imagen-3.0-generate-001",
    prompt,
    config: { numberOfImages: 1, outputMimeType: "image/jpeg" },
  });

  const imageBytes = response.generatedImages?.[0]?.image?.imageBytes;
  if (!imageBytes) {
    console.log("Image generation returned no data — skipping.");
    return "";
  }

  const imgDir = path.join(process.cwd(), "public", "images", "posts");
  fs.mkdirSync(imgDir, { recursive: true });

  const imgPath = path.join(imgDir, `${slug}.jpg`);
  fs.writeFileSync(imgPath, Buffer.from(imageBytes as string, "base64"));

  console.log(`Cover image saved: public/images/posts/${slug}.jpg`);
  return `/images/posts/${slug}.jpg`;
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
- Do NOT wrap output in code fences or backticks — output raw MDX only
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

  // Strip code fences if model wrapped the output
  fullResponse = fullResponse.trim();
  if (fullResponse.startsWith("```")) {
    fullResponse = fullResponse
      .replace(/^```[a-z]*\n?/, "")
      .replace(/\n?```$/, "")
      .trim();
  }

  // Parse frontmatter
  let title: string;
  let excerpt: string;
  try {
    const { data } = matter(fullResponse);
    title = String(data.title ?? topic);
    excerpt = String(data.excerpt ?? "");
  } catch {
    console.error("Failed to parse frontmatter from generated content.");
    process.exit(1);
  }

  const slug = customSlug ?? slugify(title);
  if (!slug) {
    console.error("Could not derive a slug from the title.");
    process.exit(1);
  }

  // Generate cover image
  const coverImage = await generateCoverImage(title, excerpt, category, slug);

  // Write final MDX with correct slug and coverImage
  let finalContent = fullResponse
    .replace(/^slug:\s*".*?"/m, `slug: "${slug}"`)
    .replace(/^coverImage:\s*".*?"/m, `coverImage: "${coverImage}"`);

  const outDir = path.join(process.cwd(), "content", "posts", category);
  fs.mkdirSync(outDir, { recursive: true });

  fs.writeFileSync(path.join(outDir, `${slug}.mdx`), finalContent, "utf-8");

  console.log(`\nDraft created: content/posts/${category}/${slug}.mdx`);
  if (coverImage) console.log(`Cover image:   public${coverImage}`);
  console.log(`Flip \`published: false\` → \`published: true\` to publish.\n`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
