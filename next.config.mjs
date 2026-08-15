/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // vendor packages ship TypeScript sources (no build step) — same pattern as Chess-Japan
  transpilePackages: ["@tosagiken/feedback-core", "@tosagiken/feedback-web"],
};

export default nextConfig;
