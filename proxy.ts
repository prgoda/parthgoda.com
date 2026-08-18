import { NextResponse, type NextRequest } from "next/server";
import {
  NETWORK_COOKIE,
  passphrase,
  tokenFor,
  tokensMatch,
} from "@/lib/network/auth";

export const config = {
  matcher: ["/network/:path*"],
};

export default async function proxy(req: NextRequest) {
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
