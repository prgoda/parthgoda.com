import { NextResponse, type NextRequest } from "next/server";
import {
  CASELOG_COOKIE,
  passphrase as caseLogPassphrase,
  tokenFor as caseLogTokenFor,
  tokensMatch as caseLogTokensMatch,
} from "@/lib/case-log/auth";
import {
  NETWORK_COOKIE,
  passphrase,
  tokenFor,
  tokensMatch,
} from "@/lib/network/auth";

export const config = {
  matcher: ["/network/:path*", "/case-log/:path*"],
};

/** Both private dashboards gate the same way; only the names differ. */
interface Gate {
  root: string;
  cookie: string;
  secret: string | null;
  tokenFor: (secret: string) => Promise<string>;
  tokensMatch: (a: string | undefined, b: string) => boolean;
}

function gateFor(pathname: string): Gate | null {
  if (pathname.startsWith("/network")) {
    return {
      root: "/network",
      cookie: NETWORK_COOKIE,
      secret: passphrase(),
      tokenFor,
      tokensMatch,
    };
  }
  if (pathname.startsWith("/case-log")) {
    return {
      root: "/case-log",
      cookie: CASELOG_COOKIE,
      secret: caseLogPassphrase(),
      tokenFor: caseLogTokenFor,
      tokensMatch: caseLogTokensMatch,
    };
  }
  return null;
}

export default async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const gate = gateFor(pathname);
  if (!gate) return NextResponse.next();

  if (!gate.secret) {
    // Unlocked is fine on localhost. In production an unset passphrase is a
    // misconfiguration, not an invitation, so the whole route disappears.
    if (process.env.NODE_ENV === "production") {
      return new NextResponse(null, { status: 404 });
    }
    return NextResponse.next();
  }

  const login = `${gate.root}/login`;
  if (pathname.startsWith(login)) return NextResponse.next();

  const expected = await gate.tokenFor(gate.secret);
  if (gate.tokensMatch(req.cookies.get(gate.cookie)?.value, expected)) {
    return NextResponse.next();
  }

  const url = req.nextUrl.clone();
  url.pathname = login;
  url.search =
    pathname === gate.root ? "" : `?next=${encodeURIComponent(pathname)}`;
  return NextResponse.redirect(url);
}
