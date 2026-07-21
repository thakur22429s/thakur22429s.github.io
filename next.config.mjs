/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Pin the workspace root to this project (a stray lockfile lives in the home dir).
  outputFileTracingRoot: import.meta.dirname,
};

export default nextConfig;
