// next.config.mjs
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Add your other Next.js configuration options here
  reactStrictMode: true,
  images: {
    domains: ["your-image-domain.com"], // Replace with the domains that serve your images
  },
};

export default nextConfig;
