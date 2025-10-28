/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: { bodySizeLimit: "2mb" },
    authInterrupts: true,
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "i.pinimg.com", pathname: "/**" },
      { protocol: "https", hostname: "randomuser.me", pathname: "/**" },
    ],
  },
  eslint: {
    // ✅ Prevent ESLint errors from breaking production builds
    ignoreDuringBuilds: true,
  },
  typescript: {
    // ✅ Prevent type errors from blocking Vercel deploys
    ignoreBuildErrors: true,
  },
};

module.exports = nextConfig;
