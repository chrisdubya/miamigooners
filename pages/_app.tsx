import {useState, useEffect} from 'react'
import Head from 'next/head'
import {useRouter} from 'next/router'
import {AppProps} from 'next/app'
import {ThemeProvider} from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import {CacheProvider, EmotionCache} from '@emotion/react'
import theme from '../src/theme'
import createEmotionCache from '../src/utils/createEmotionCache'
import Script from 'next/script'
import '../styles/globals.css'
import {UserProvider} from '@auth0/nextjs-auth0/client'
import {CartProvider} from '../src/context/CartContext'
import {LoadingOverlay} from '../src/LoadingOverlay'

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache()

interface MyAppProps extends AppProps {
  emotionCache?: EmotionCache
}

export default function MyApp(props: MyAppProps) {
  const {Component, emotionCache = clientSideEmotionCache, pageProps} = props
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const handleStart = () => setIsLoading(true)
    const handleComplete = () => setIsLoading(false)

    router.events.on('routeChangeStart', handleStart)
    router.events.on('routeChangeComplete', handleComplete)
    router.events.on('routeChangeError', handleComplete)

    return () => {
      router.events.off('routeChangeStart', handleStart)
      router.events.off('routeChangeComplete', handleComplete)
      router.events.off('routeChangeError', handleComplete)
    }
  }, [router])

  return (
    <CacheProvider value={emotionCache}>
      <Head>
        {/* Primary Meta Tags */}
        <title>
          The Official Miami Arsenal FC Supporters Club in Miami, FL - Miami
          Gooners
        </title>
        <meta
          name="title"
          content="The Official Miami Arsenal FC Supporters Club in Miami, FL - Miami Gooners"
        />
        <meta
          name="description"
          content="Miami Gooners: Official Arsenal FC Supporters Club. We watch all matches @thebargables. Follow us on instagram and X @miamigooners."
        />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://miamigooners.com/" />
        <meta
          property="og:title"
          content="The Official Miami Arsenal FC Supporters Club in Miami, FL - Miami Gooners"
        />
        <meta
          property="og:description"
          content="Miami Gooners: Official Arsenal FC Supporters Club. We watch all matches @thebargables. Follow us on instagram and X @miamigooners."
        />
        <meta
          property="og:image"
          content="https://miamigooners.com/og-image.jpg"
        />

        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://miamigooners.com/" />
        <meta
          property="twitter:title"
          content="The Official Miami Arsenal FC Supporters Club in Miami, FL - Miami Gooners"
        />
        <meta
          property="twitter:description"
          content="Miami Gooners: Official Arsenal FC Supporters Club. We watch all matches @thebargables. Follow us on instagram and X @miamigooners."
        />
        <meta
          property="twitter:image"
          content="https://miamigooners.com/og-image.jpg"
        ></meta>

        <meta name="viewport" content="initial-scale=1, width=device-width" />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5" />
        <meta name="msapplication-TileColor" content="#da532c" />
        <meta name="theme-color" content="#ff0000"></meta>

        {/* Organization Schema (JSON-LD) */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'SportsClub',
              name: 'Miami Gooners',
              url: 'https://miamigooners.com',
              logo: 'https://miamigooners.com/og-image.jpg',
              description: 'Official Arsenal FC Supporters Club in Miami, FL',
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
      </Head>
      <Script
        strategy="afterInteractive"
        src="https://www.googletagmanager.com/gtag/js?id=G-1ZGEWQ7JLM"
      />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-1ZGEWQ7JLM');
          `,
        }}
      />
      <ThemeProvider theme={theme}>
        {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
        <CssBaseline />
        <LoadingOverlay open={isLoading} />
        <UserProvider>
          <CartProvider>
            <Component {...pageProps} />
          </CartProvider>
        </UserProvider>
      </ThemeProvider>
    </CacheProvider>
  )
}
