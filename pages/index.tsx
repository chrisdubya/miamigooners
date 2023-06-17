import { Scene } from "../src/Scene";
import { Container, Box, Link } from "@mui/material";
import { Twitter, Instagram } from "@mui/icons-material";
import { AllEvents } from "../src/AllEvents";

export default function Home() {
	return (
		<Container sx={{ paddingRight: 0, paddingLeft: 0 }}>
			<Box component='div' sx={{ height: "70vh" }}>
				<Box
					component='div'
					sx={{
						position: "absolute",
						height: "70vh",
						zIndex: "-1",
						inset: 0,
						background: "url(/background.jpeg) no-repeat center center fixed",
						backgroundSize: "cover",
					}}
				/>

				<Scene />

				<Box
					component='div'
					sx={{
						display: "flex",
						gap: "0.5rem",
						position: "absolute",
						top: "2rem",
						right: "2rem",
					}}>
					<Link href='https://www.instagram.com/miamigooners'>
						<Instagram color='primary' fontSize='large' />
					</Link>
					<Link href='https://twitter.com/miamigooners'>
						<Twitter color='primary' fontSize='large' />
					</Link>
				</Box>
			</Box>

			<Box component='div'>
				<AllEvents />
			</Box>
		</Container>
	);
}
