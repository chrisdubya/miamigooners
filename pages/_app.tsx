import * as React from 'react'
import Head from 'next/head'
import {AppProps} from 'next/app'
import {ThemeProvider} from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import {CacheProvider, EmotionCache} from '@emotion/react'
import theme from '../src/theme'
import createEmotionCache from '../src/utils/createEmotionCache'
import Script from 'next/script'
import '../styles/globals.css'
import { UserProvider } from '@auth0/nextjs-auth0/client';

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache()

interface MyAppProps extends AppProps {
  emotionCache?: EmotionCache
}

export default function MyApp(props: MyAppProps) {
  const {Component, emotionCache = clientSideEmotionCache, pageProps} = props
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
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
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
      </Head>
      <Script
        strategy="afterInteractive"
        src="https://www.googletagmanager.com/gtag/js?id=G-1ZGEWQ7JLM"
      />
      <ThemeProvider theme={theme}>
        {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
        <CssBaseline />
        <UserProvider>
          <Component {...pageProps} />
        </UserProvider>
      </ThemeProvider>
    </CacheProvider>
  )
}
