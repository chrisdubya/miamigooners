import * as React from "react";
import Head from "next/head";
import { AppProps } from "next/app";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { CacheProvider, EmotionCache } from "@emotion/react";
import theme from "../src/theme";
import createEmotionCache from "../src/createEmotionCache";
import Script from "next/script";

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

interface MyAppProps extends AppProps {
	emotionCache?: EmotionCache;
}

export default function MyApp(props: MyAppProps) {
	const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;
	return (
		<CacheProvider value={emotionCache}>
			<Head>
				{/* Primary Meta Tags */}
				<title>
					Arsenal Football Supporters Club in Miami, FL - Miami Gooners
				</title>
				<meta
					name='title'
					content='Arsenal Football Supporters Club in Miami, FL - Miami Gooners'
				/>
				<meta
					name='description'
					content='Miami Gooners, the Rebel Arsenal FC Supporters Club in Miami, Florida.  Follow us on instagram @miamigooners.'
				/>

				{/* Open Graph / Facebook */}
				<meta property='og:type' content='website' />
				<meta property='og:url' content='https://miamigooners.com/' />
				<meta
					property='og:title'
					content='Arsenal Football Supporters Club in Miami, FL - Miami Gooners'
				/>
				<meta
					property='og:description'
					content='Miami Gooners, the Rebel Arsenal FC Supporters Club in Miami, Florida.  Follow us on instagram @miamigooners.'
				/>
				<meta
					property='og:image'
					content='https://miamigooners.com/og-image.png'
				/>

				{/* Twitter */}
				<meta property='twitter:card' content='summary_large_image' />
				<meta property='twitter:url' content='https://miamigooners.com/' />
				<meta
					property='twitter:title'
					content='Arsenal Football Supporters Club in Miami, FL - Miami Gooners'
				/>
				<meta
					property='twitter:description'
					content='Miami Gooners, the Rebel Arsenal FC Supporters Club in Miami, Florida.  Follow us on instagram @miamigooners.'
				/>
				<meta
					property='twitter:image'
					content='https://miamigooners.com/og-image.png'></meta>

				<meta name='viewport' content='initial-scale=1, width=device-width' />
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
			</Head>
			<Script
				strategy='afterInteractive'
				src='https://www.googletagmanager.com/gtag/js?id=G-1ZGEWQ7JLM'
			/>
			<ThemeProvider theme={theme}>
				{/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
				<CssBaseline />
				<Component {...pageProps} />
			</ThemeProvider>
		</CacheProvider>
	);
}
