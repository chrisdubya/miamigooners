import { Container, Box, Typography } from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import { Event } from "./Event";
import { DateTime } from "luxon";
import axios from "axios";
import { useEffect, useState } from "react";

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
}

const images = ["bournemouth-home", "everton-away", "leicester-away"];

export const AllEvents = () => {
	const [data, setData] = useState<EventType[]>([]);

	const getEvents = async () => {
		const res = await axios.get("/api/events");
		const events = res.data;

		const updatedEvents = events.map((event: EventType) => {
			const homeTeamImage = event.HomeTeam.toLowerCase();
			const awayTeamImage = event.AwayTeam.toLowerCase();

			if (images.includes(`${awayTeamImage}-home`)) {
				return { ...event, image: `/images/${awayTeamImage}-home.jpg` };
			}

			if (images.includes(`${homeTeamImage}-away`)) {
				return { ...event, image: `/images/${homeTeamImage}-away.jpg` };
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
				<Typography variant='h3' gutterBottom color={"primary"} mt={4}>
					Upcoming Events
				</Typography>

				<Grid container spacing={2} mt={2}>
					{data?.length &&
						data
							.filter(
								(val) =>
									DateTime.fromFormat(val.DateUtc, "yyyy-MM-dd HH:mm:ss'Z'", {
										zone: "utc",
									})
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
							.map((event, index) => <Event key={index} event={event} />)}
				</Grid>

				<Typography variant='h3' gutterBottom color={"primary"} mt={4}>
					Past Events
				</Typography>

				<Grid container spacing={2} mt={2}>
					{data?.length &&
						data
							.filter(
								(val) =>
									DateTime.fromFormat(val.DateUtc, "yyyy-MM-dd HH:mm:ss'Z'", {
										zone: "utc",
									})
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
								return dateA.toMillis() - dateB.toMillis();
							})
							.map((event, index) => (
								<Event key={index} event={event} past={true} />
							))}
				</Grid>
			</Box>
		</Container>
	);
};
