import { tokensMatch } from "./auth";

/**
 * The caser-facing feedback link.
 *
 * The token is derived from CASELOG_SECRET rather than stored as its own
 * setting, so the link works wherever the app already runs with no extra
 * configuration. Truncated SHA-256 is not reversible, so publishing it in a URL
 * gives nothing away about the secret itself.
 *
 * Rotating CASELOG_SECRET changes the link, which is the intended escape hatch
 * if it ever ends up somewhere you did not mean to send it.
 */
const FALLBACK_SECRET = "parthgoda-caselog-salt";

export async function feedbackToken(): Promise<string> {
  const salt = process.env.CASELOG_SECRET ?? FALLBACK_SECRET;
  const bytes = new TextEncoder().encode(`${salt}:feedback-link`);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return [...new Uint8Array(digest)]
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")
    .slice(0, 16);
}

export async function feedbackPath(): Promise<string> {
  return `/case-log/feedback/${await feedbackToken()}`;
}

/** Compared in constant-ish time, since this is the only thing gating the form. */
export async function isValidFeedbackToken(token: string): Promise<boolean> {
  return tokensMatch(token, await feedbackToken());
}
