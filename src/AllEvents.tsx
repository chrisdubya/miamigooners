import {
	Container,
	Box,
	Typography,
	Accordion,
	AccordionSummary,
	AccordionDetails,
} from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import { Event } from "./Event";
import { DateTime } from "luxon";
import axios from "axios";
import { useEffect, useState } from "react";
import { images } from "./constants/images";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

export interface EventType {
	MatchNumber: number;
	RoundNumber: number;
	DateUtc: string;
	Location: string;
	HomeTeam: string;
	AwayTeam: string;
	Group?: string;
	HomeTeamScore?: number;
	AwayTeamScore?: number;
	image?: string;
	competition?: string;
}

export const AllEvents = () => {
	const [data, setData] = useState<EventType[]>([]);

	const getEvents = async () => {
		const res = await axios.get("/api/events");
		const events = res.data;

		const updatedEvents = events.map((event: EventType) => {
			const homeTeamImage = event.HomeTeam.toLowerCase().replace(/\s/g, "-");
			const awayTeamImage = event.AwayTeam.toLowerCase().replace(/\s/g, "-");

			if (images.includes(`${awayTeamImage}-home`)) {
				event = {
					...event,
					image: `${process.env.NEXT_PUBLIC_CDN_URL}/images/matchday-photos/${awayTeamImage}-home.jpg`,
				};
			}

			if (images.includes(`${homeTeamImage}-away`)) {
				event = {
					...event,
					image: `${process.env.NEXT_PUBLIC_CDN_URL}/images/matchday-photos/${homeTeamImage}-away.jpg`,
				};
			}

			// schedule updates July 8th (until API updates)
			if (
				DateTime.fromFormat(event.DateUtc, "yyyy-MM-dd HH:mm:ss'Z'", {
					zone: "utc",
				}).year === 2023
			) {
				if (
					event.HomeTeam === "Crystal Palace" &&
					DateTime.fromFormat(event.DateUtc, "yyyy-MM-dd HH:mm:ss'Z'", {
						zone: "utc",
					}).month === 8
				) {
					event = {
						...event,
						DateUtc: "2023-08-21 19:00:00Z",
					};
				}

				if (
					event.AwayTeam === "Man Utd" &&
					DateTime.fromFormat(event.DateUtc, "yyyy-MM-dd HH:mm:ss'Z'", {
						zone: "utc",
					}).month === 9
				) {
					event = {
						...event,
						DateUtc: "2023-09-03 15:30:00Z",
					};
				}

				if (
					event.HomeTeam === "Everton" &&
					DateTime.fromFormat(event.DateUtc, "yyyy-MM-dd HH:mm:ss'Z'", {
						zone: "utc",
					}).month === 9
				) {
					event = {
						...event,
						DateUtc: "2023-09-16 16:30:00Z",
					};
				}

				if (
					event.AwayTeam === "Spurs" &&
					DateTime.fromFormat(event.DateUtc, "yyyy-MM-dd HH:mm:ss'Z'", {
						zone: "utc",
					}).month === 9
				) {
					event = {
						...event,
						DateUtc: "2023-09-24 13:00:00Z",
					};
				}
			}

			return event;
		});

		setData(updatedEvents);
	};

	useEffect(() => {
		getEvents();
	}, []);

	return (
		<Container>
			<Box component='div' mb={8}>
				<Accordion
					defaultExpanded={true}
					sx={{
						bgcolor: "transparent",
						backgroundImage: "none",
						boxShadow: "none",
					}}>
					<AccordionSummary
						expandIcon={<ExpandMoreIcon color='primary' />}
						aria-controls='panel1a-content'
						id='panel1a-header'>
						<Typography variant='h3' gutterBottom color={"primary"} mt={4}>
							Upcoming Events
						</Typography>
					</AccordionSummary>

					<AccordionDetails>
						<Grid container spacing={2} mt={2}>
							{data?.length ? (
								data
									.filter(
										(val) =>
											DateTime.fromFormat(
												val.DateUtc,
												"yyyy-MM-dd HH:mm:ss'Z'",
												{
													zone: "utc",
												}
											)
												.setZone("America/New_York")
												.toISODate() > DateTime.now().toISODate()
									)
									.sort((a, b) => {
										const dateA = DateTime.fromFormat(
											a.DateUtc,
											"yyyy-MM-dd HH:mm:ss'Z'",
											{
												zone: "utc",
											}
										);
										const dateB = DateTime.fromFormat(
											b.DateUtc,
											"yyyy-MM-dd HH:mm:ss'Z'",
											{
												zone: "utc",
											}
										);
										return dateA.toMillis() - dateB.toMillis();
									})
									.map((event, index) => (
										<Event key={index} index={index} event={event} />
									))
							) : (
								<Typography variant='h5' gutterBottom color={"#fff"} ml={1}>
									loading...
								</Typography>
							)}
						</Grid>
					</AccordionDetails>
				</Accordion>

				<Accordion
					sx={{
						bgcolor: "transparent",
						backgroundImage: "none",
						boxShadow: "none",
					}}>
					<AccordionSummary
						expandIcon={<ExpandMoreIcon color='primary' />}
						aria-controls='panel1a-content'
						id='panel1a-header'>
						<Typography variant='h3' gutterBottom color={"primary"} mt={4}>
							Past Events
						</Typography>
					</AccordionSummary>
					<AccordionDetails>
						<Grid container spacing={2} mt={2}>
							{data?.length ? (
								data
									.filter(
										(val) =>
											DateTime.fromFormat(
												val.DateUtc,
												"yyyy-MM-dd HH:mm:ss'Z'",
												{
													zone: "utc",
												}
											)
												.setZone("America/New_York")
												.toISODate() < DateTime.now().toISODate()
									)
									.sort((a, b) => {
										const dateA = DateTime.fromFormat(
											a.DateUtc,
											"yyyy-MM-dd HH:mm:ss'Z'",
											{
												zone: "utc",
											}
										);
										const dateB = DateTime.fromFormat(
											b.DateUtc,
											"yyyy-MM-dd HH:mm:ss'Z'",
											{
												zone: "utc",
											}
										);
										return dateB.toMillis() - dateA.toMillis();
									})
									.map((event, index) => (
										<Event
											key={index}
											index={index}
											event={event}
											past={true}
										/>
									))
							) : (
								<Typography variant='h5' gutterBottom color={"#fff"} ml={1}>
									loading...
								</Typography>
							)}
						</Grid>
					</AccordionDetails>
				</Accordion>
			</Box>
		</Container>
	);
};
