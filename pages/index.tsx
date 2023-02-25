import { Scene } from "../src/Scene";
import { Link, Typography } from "@mui/material";
import InstagramIcon from "@mui/icons-material/Instagram";

export default function Home() {
	return (
		<>
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
					bottom: "2rem",
					left: "50%",
					transform: "translateX(-50%)",
				}}>
				<Typography variant='body1' color='primary'>
					coming soon...
				</Typography>
			</div>
		</>
	);
}
