import type {Metadata} from 'next'
import ThemeRegistry from './ThemeRegistry'
import NavigationLoader from './NavigationLoader'
import Providers from './Providers'
import {inter} from '../src/font'
import '../styles/globals.css'
import {SpeedInsights} from '@vercel/speed-insights/next'
import {Navbar} from '../src/Navbar'

export const metadata: Metadata = {
  title:
    'The Official Miami Arsenal FC Supporters Club in Miami, FL - Miami Gooners',
  description:
    'Miami Gooners: Official Arsenal FC Supporters Club. We watch all matches @thebargables. Follow us on instagram and X @miamigooners.',
  openGraph: {
    type: 'website',
    url: 'https://miamigooners.com/',
    title:
      'The Official Miami Arsenal FC Supporters Club in Miami, FL - Miami Gooners',
    description:
      'Miami Gooners: Official Arsenal FC Supporters Club. We watch all matches @thebargables. Follow us on instagram and X @miamigooners.',
    images: ['https://miamigooners.com/og-image.jpg'],
    siteName: 'Miami Gooners',
  },
  twitter: {
    card: 'summary_large_image',
    title:
      'The Official Miami Arsenal FC Supporters Club in Miami, FL - Miami Gooners',
    description:
      'Miami Gooners: Official Arsenal FC Supporters Club. We watch all matches @thebargables. Follow us on instagram and X @miamigooners.',
    images: ['https://miamigooners.com/og-image.jpg'],
  },
  icons: {
    icon: [
      {url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png'},
      {url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png'},
    ],
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
  other: {
    'msapplication-TileColor': '#da532c',
    'theme-color': '#DB0007',
  },
}

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" className={inter.className}>
      <head>
        <meta name="emotion-insertion-point" content="" />
        <script
          type="application/ld+json"
          suppressHydrationWarning
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'SportsClub',
              name: 'Miami Gooners',
              url: 'https://miamigooners.com',
              logo: 'https://miamigooners.com/og-image.jpg',
              description:
                'Official Arsenal FC Supporters Club in Miami, FL',
              sameAs: [
                'https://instagram.com/miamigooners',
                'https://twitter.com/miamigooners',
              ],
              location: {
                '@type': 'Place',
                name: 'The Bar Gables',
                address: {
                  '@type': 'PostalAddress',
                  addressLocality: 'Miami',
                  addressRegion: 'FL',
                  addressCountry: 'US',
                },
              },
            }),
          }}
        />
      </head>
      <body>
        {/* eslint-disable-next-line @next/next/no-sync-scripts */}
        <script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-1ZGEWQ7JLM"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-1ZGEWQ7JLM');
            `,
          }}
        />
        <ThemeRegistry>
          <NavigationLoader />
          <Providers>
            <Navbar />
            {children}
            <SpeedInsights />
          </Providers>
        </ThemeRegistry>
      </body>
    </html>
  )
}
