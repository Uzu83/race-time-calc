/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Expose Vercel env to the client bundle for feedback fail-closed (GPT r2 F001).
  env: {
    NEXT_PUBLIC_VERCEL_ENV: process.env.VERCEL_ENV ?? "",
  },
  // vendor packages ship TypeScript sources (no build step) — same pattern as Chess-Japan
  transpilePackages: ["@tosagiken/feedback-core", "@tosagiken/feedback-web"],
};

export default nextConfig;
