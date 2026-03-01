import {Inter, JetBrains_Mono} from 'next/font/google'
import localFont from 'next/font/local'

export const inter = Inter({
  weight: ['300', '400', '500', '600', '700'],
  subsets: ['latin'],
  display: 'swap',
  fallback: ['system-ui', '-apple-system', 'sans-serif'],
})

export const doppler = localFont({
  src: [
    {path: '../public/fonts/doppler-regular-webfont.woff2'},
    {path: '../public/fonts/doppler-regular-webfont.woff'},
  ],
  display: 'swap',
  fallback: ['Georgia', 'serif'],
})

export const jetbrainsMono = JetBrains_Mono({
  weight: ['400', '500', '700'],
  subsets: ['latin'],
  display: 'swap',
  fallback: ['ui-monospace', 'Courier New', 'monospace'],
})

// Keep backward compat export
export const roboto = inter
