export const getBaseUrl = () => {
  // Check if running in Vercel environment
  if (process.env.VERCEL_URL) {
    // Use VERCEL_URL when deployed
    return `https://${process.env.VERCEL_URL}`
  } else {
    // Fallback to localhost when running locally
    return 'http://localhost:3000'
  }
}
