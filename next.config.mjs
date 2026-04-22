import {withAxiom} from 'next-axiom'

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: '/&',
        destination: '/',
        permanent: false,
      },
    ]
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.shopify.com',
      },
      {
        protocol: 'https',
        hostname: 'drive.google.com',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
    ],
  },
  transpilePackages: [
    '@emotion/react',
    '@emotion/styled',
    '@emotion/cache',
    '@mui/material',
    '@mui/icons-material',
    '@mui/system',
  ],
  env: {
    NEXT_PUBLIC_VERCEL_URL: process.env.VERCEL_URL,
    NEXT_PUBLIC_VERCEL_ENV: process.env.VERCEL_ENV,
  },
  productionBrowserSourceMaps: true,
  turbopack: {
    root: process.cwd(),
  },
}

export default withAxiom(nextConfig)
