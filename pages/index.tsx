import React, { useRef, useState, useEffect } from "react";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import NET from "vanta/dist/vanta.net.min.js";
import * as THREE from "three";

export default function Home() {
	const [vantaEffect, setVantaEffect] = useState<any>(null);
	const vantaRef = useRef(null);

	useEffect(() => {
		if (!vantaEffect) {
			setVantaEffect(
				NET({
					el: vantaRef.current,
					mouseControls: true,
					touchControls: true,
					gyroControls: false,
					minHeight: 200.0,
					minWidth: 200.0,
					scale: 1.0,
					scaleMobile: 1.0,
					color: 0xff0000,
					backgroundColor: 0x000000,
					THREE,
				})
			);
		}
		return () => {
			if (vantaEffect) vantaEffect.destroy();
		};
	}, [vantaEffect]);

	return (
		<Container maxWidth={false} disableGutters>
			<Box sx={{ width: "100vw", height: "100vh" }} ref={vantaRef}></Box>
		</Container>
	);
}
