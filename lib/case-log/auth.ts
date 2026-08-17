/**
 * The case log is public to read and locked to write. A 4-digit PIN from the
 * environment is exchanged for a cookie holding its salted SHA-256, and every
 * mutating path checks that cookie.
 *
 * Deliberately modest: this keeps a public form from being a public whiteboard.
 * It is not protection against someone determined, and a 4-digit space is small
 * enough to brute force if anyone bothers to try.
 */
export const CASELOG_COOKIE = "caselog_writer";

const FALLBACK_SECRET = "parthgoda-caselog-salt";

/** The configured PIN, or null when writing is not configured at all. */
export function writePin(): string | null {
  const value = process.env.CASELOG_PIN?.trim();
  return value ? value : null;
}

/** Runs in both the Node and Edge runtimes, so it uses Web Crypto. */
export async function tokenFor(pin: string): Promise<string> {
  const salt = process.env.CASELOG_SECRET ?? FALLBACK_SECRET;
  const bytes = new TextEncoder().encode(`${salt}:${pin}`);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return [...new Uint8Array(digest)]
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

/** Constant-time-ish compare; both inputs are fixed-length hex here. */
export function tokensMatch(a: string | undefined, b: string): boolean {
  if (!a || a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

/**
 * With no PIN configured, writing is open in dev and closed in production.
 * A misconfigured deploy should be read-only, not a public whiteboard.
 */
export function writingOpenWithoutPin(): boolean {
  return process.env.NODE_ENV !== "production";
}
