import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  // output: "standalone" is recommended for Railway/Docker deployments
  // It bundles only necessary files and reduces image size significantly.
  output: "standalone",
};

export default nextConfig;
