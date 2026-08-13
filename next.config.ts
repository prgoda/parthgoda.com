import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // better-sqlite3 is a native module; it has to stay outside the bundle.
  serverExternalPackages: ["better-sqlite3"],
};

export default nextConfig;
