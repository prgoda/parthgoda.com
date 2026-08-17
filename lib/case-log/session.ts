import { cookies } from "next/headers";
import {
  CASELOG_COOKIE,
  tokenFor,
  tokensMatch,
  writePin,
  writingOpenWithoutPin,
} from "./auth";

/**
 * Whether this request may create, edit or delete. Server-side only, and the
 * single source of truth: pages call it to decide what buttons to render, and
 * the actions call it again before touching the database. Hiding a button is
 * not a check — the second call is the one that matters.
 */
export async function canWrite(): Promise<boolean> {
  const pin = writePin();
  if (!pin) return writingOpenWithoutPin();

  const jar = await cookies();
  return tokensMatch(jar.get(CASELOG_COOKIE)?.value, await tokenFor(pin));
}
