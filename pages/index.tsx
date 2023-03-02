import { Scene } from "../src/Scene";
import { Container, Box, Link } from "@mui/material";
import InstagramIcon from "@mui/icons-material/Instagram";
import { AllEvents } from "../src/AllEvents";

export default function Home() {
	return (
		<Container>
			<Box component='div' sx={{ height: "80vh" }}>
				<div
					style={{
						position: "absolute",
						height: "80vh",
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
			</Box>

			<Box component='div'>
				<AllEvents />
			</Box>
		</Container>
	);
}
