import { Scene } from "../src/Scene";
import { Container, Box, Link, Typography } from "@mui/material";
import InstagramIcon from "@mui/icons-material/Instagram";
import { AllEvents } from "../src/AllEvents";

export default function Home() {
	return (
		<Container>
			<Box component='div' sx={{ height: "100vh" }}>
				<div
					style={{
						position: "absolute",
						zIndex: "-1",
						inset: 0,
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
						bottom: "6rem",
						left: "50%",
						transform: "translateX(-50%)",
					}}>
					<Typography
						sx={{ fontWeight: "bold" }}
						variant='body1'
						color='primary'>
						coming soon...
					</Typography>
				</div>
			</Box>

			<Box component='div'>
				<AllEvents />
			</Box>
		</Container>
	);
}
