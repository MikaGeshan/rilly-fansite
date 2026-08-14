import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // External packages that should be bundled with the serverless function
  serverExternalPackages: ["ghostfetch", "@ghostfetch/engine-linux-x64"],

  // Include go engine on vercel
  outputFileTracingIncludes: {
    "/api/**/*": [
      "./node_modules/@ghostfetch/**/*",
      "./node_modules/ghostfetch/**/*",
    ],
  },
};

export default nextConfig;
