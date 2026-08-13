import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // libSQL ships native bindings for the local-file driver; keep them out of
  // the bundle so the same code runs against Turso in production.
  serverExternalPackages: ["@libsql/client", "libsql"],
};

export default nextConfig;
