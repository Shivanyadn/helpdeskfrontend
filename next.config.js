/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  basePath: '/v1/helpdesk',
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://help.zenapi.co.in/:path*',
      },
    ];
  },
};

module.exports = nextConfig;