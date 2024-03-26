/** @type {import('next').NextConfig} */
const {withAxiom} = require('next-axiom')

module.exports = withAxiom({
  reactStrictMode: true,
  env: {
    NEXT_PUBLIC_VERCEL_URL: process.env.VERCEL_URL,
    NEXT_PUBLIC_VERCEL_ENV: process.env.VERCEL_ENV,
  },
  productionBrowserSourceMaps: true,
})
