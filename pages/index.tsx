import { Scene } from "../src/Scene";
import { Link, Typography } from "@mui/material";
import InstagramIcon from "@mui/icons-material/Instagram";
import Head from "next/head";

export default function Home() {
	return (
		<>
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
			</Head>
			<div
				style={{
					position: "absolute",
					zIndex: "-1",
					inset: 0,
					width: "100vw",
					height: "100vh",
					background: "url(/background.jpeg) no-repeat center center fixed",
					backgroundSize: "cover",
				}}></div>
			<Scene />
			<div style={{ position: "absolute", top: "2rem", right: "2rem" }}>
				<Link href='https://www.instagram.com/miamigooners/'>
					<InstagramIcon color='primary' fontSize='large' />
				</Link>
			</div>
			<div
				style={{
					position: "absolute",
					bottom: "4rem",
					left: "50%",
					transform: "translateX(-50%)",
				}}>
				<Typography sx={{ fontWeight: "bold" }} variant='body1' color='primary'>
					coming soon...
				</Typography>
			</div>
		</>
	);
}
