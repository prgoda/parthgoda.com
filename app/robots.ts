import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // /case-log is public and crawlable; only its write screens are locked.
      disallow: ["/network"],
    },
  };
}
