import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  outputFileTracingIncludes: {
    "/api/schedule": ["./scripts/fetch_jkt48_schedule.py", "./.python_packages/**/*"],
  },
};

export default nextConfig;
