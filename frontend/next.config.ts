import type { NextConfig } from "next";

type NextConfigWithTurbopack = NextConfig & {
  // Add Turbopack config to avoid root mis-detection when multiple lockfiles exist
  turbopack?: {
    root?: string;
  };
};

const nextConfig: NextConfigWithTurbopack = {
  output: "standalone",
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;
