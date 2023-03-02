import { Container, Typography } from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import { Event } from "./Event";
import { DateTime } from "luxon";

export interface EventType {
	type: string;
	date: DateTime;
	title: string;
	location: string;
	rsvpLink?: string;
}

const events: EventType[] = [
	{
		type: "Watch Party",
		date: DateTime.fromFormat("03/04/2023", "MM/dd/yyyy"),
		title: "Arsenal vs Bournemouth",
		location: "Fritz and Franz",
	},
	{
		type: "Watch Party",
		date: DateTime.fromFormat("03/01/2023", "MM/dd/yyyy"),
		title: "Arsenal vs Everton",
		location: "Lost Boy, Dry Goods",
		rsvpLink:
			"https://www.eventbrite.com/e/arsenal-v-everton-watch-with-the-miami-gooners-tickets-566559092497",
	},
];

export const AllEvents = () => {
	const today = DateTime.now();
	console.log(events[1].date.toISOTime() < DateTime.now().toISOTime());
	return (
		<Container>
			<Typography variant='h2' gutterBottom color={"primary"} mt={4}>
				Upcomming Events
			</Typography>

			<Grid container spacing={2} mt={4}>
				{events
					.filter((val) => val.date.toISODate() > DateTime.now().toISODate())
					.map((event, index) => (
						<Event key={index} event={event} />
					))}
			</Grid>

			<Typography variant='h2' gutterBottom color={"primary"} mt={4}>
				Past Events
			</Typography>

			<Grid container spacing={2} mt={4}>
				{events
					.filter((val) => val.date.toISODate() < DateTime.now().toISODate())
					.map((event, index) => (
						<Event key={index} event={event} past={true} />
					))}
			</Grid>
		</Container>
	);
};
