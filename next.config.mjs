import {withAxiom} from 'next-axiom'

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
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
}

export default withAxiom(nextConfig)
