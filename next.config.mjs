/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: { remotePatterns: [] },
  // Arena/E2B preview hosts are proxied subdomains; allow their dev assets.
  // (Production deploys on Netlify do not need this.)
  allowedDevOrigins: ['*.e2b.app', '*.netlify.app'],
};
export default nextConfig;
