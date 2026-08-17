/**
 * Same thin lock as /network: one passphrase from the environment, exchanged
 * for a cookie holding its salted SHA-256. The log carries other people's
 * names and candid feedback, so it should not be idly browsable — but this is
 * not a real auth system and does not pretend to be.
 */
export const CASELOG_COOKIE = "caselog_key";

const FALLBACK_SECRET = "parthgoda-caselog-salt";

export function passphrase(): string | null {
  const value = process.env.CASELOG_PASSPHRASE?.trim();
  return value ? value : null;
}

/** Runs in both the Node and Edge runtimes, so it uses Web Crypto. */
export async function tokenFor(secret: string): Promise<string> {
  const salt = process.env.CASELOG_SECRET ?? FALLBACK_SECRET;
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
