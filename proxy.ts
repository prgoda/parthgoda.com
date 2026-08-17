import { NextResponse, type NextRequest } from "next/server";
import {
  CASELOG_COOKIE,
  tokenFor as caseLogTokenFor,
  tokensMatch as caseLogTokensMatch,
  writePin,
  writingOpenWithoutPin,
} from "@/lib/case-log/auth";
import {
  NETWORK_COOKIE,
  passphrase,
  tokenFor,
  tokensMatch,
} from "@/lib/network/auth";

export const config = {
  matcher: [
    "/network/:path*",
    // The case log is public to read; only the write screens are gated.
    "/case-log/cases/new",
    "/case-log/cases/:id/edit",
  ],
};

/** /network: the whole dashboard is private. */
async function guardNetwork(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const secret = passphrase();

  if (!secret) {
    // Unlocked is fine on localhost. In production an unset passphrase is a
    // misconfiguration, not an invitation, so the whole route disappears.
    if (process.env.NODE_ENV === "production") {
      return new NextResponse(null, { status: 404 });
    }
    return NextResponse.next();
  }

  if (pathname.startsWith("/network/login")) return NextResponse.next();

  const expected = await tokenFor(secret);
  if (tokensMatch(req.cookies.get(NETWORK_COOKIE)?.value, expected)) {
    return NextResponse.next();
  }

  const url = req.nextUrl.clone();
  url.pathname = "/network/login";
  url.search =
    pathname === "/network" ? "" : `?next=${encodeURIComponent(pathname)}`;
  return NextResponse.redirect(url);
}

/**
 * /case-log: send anyone without the writer cookie to the PIN screen. This only
 * saves them from filling in a form they cannot submit — the server actions
 * check the same cookie themselves before writing anything.
 */
async function guardCaseLogWrites(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const pin = writePin();

  if (!pin) {
    if (writingOpenWithoutPin()) return NextResponse.next();
    // Read-only deploy: there is no PIN to let anyone in with.
    const url = req.nextUrl.clone();
    url.pathname = "/case-log/unlock";
    url.search = "?unconfigured=1";
    return NextResponse.redirect(url);
  }

  const expected = await caseLogTokenFor(pin);
  if (caseLogTokensMatch(req.cookies.get(CASELOG_COOKIE)?.value, expected)) {
    return NextResponse.next();
  }

  const url = req.nextUrl.clone();
  url.pathname = "/case-log/unlock";
  url.search = `?next=${encodeURIComponent(pathname)}`;
  return NextResponse.redirect(url);
}

export default async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (pathname.startsWith("/network")) return guardNetwork(req);
  if (pathname.startsWith("/case-log")) return guardCaseLogWrites(req);
  return NextResponse.next();
}
