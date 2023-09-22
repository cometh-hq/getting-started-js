/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  experimental: {
    esmExternals: "loose",
  },
};

module.exports = nextConfig;
