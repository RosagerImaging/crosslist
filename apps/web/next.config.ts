// eslint-disable-next-line @typescript-eslint/no-unused-vars
import path from "path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  outputFileTracingRoot: path.join(__dirname, '../../'),
  /* config options here */
};

export default nextConfig;
