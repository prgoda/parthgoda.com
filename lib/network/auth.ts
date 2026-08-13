/**
 * A thin lock on a personal, local-only app: one passphrase from the
 * environment, exchanged for a cookie holding its salted SHA-256. Enough to
 * keep /network from being idly browsable, not a real auth system.
 */
export const NETWORK_COOKIE = "network_key";

const FALLBACK_SECRET = "parthgoda-network-salt";

export function passphrase(): string | null {
  const value = process.env.NETWORK_PASSPHRASE?.trim();
  return value ? value : null;
}

/** Runs in both the Node and Edge runtimes, so it uses Web Crypto. */
export async function tokenFor(secret: string): Promise<string> {
  const salt = process.env.NETWORK_SECRET ?? FALLBACK_SECRET;
  const bytes = new TextEncoder().encode(`${salt}:${secret}`);
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
