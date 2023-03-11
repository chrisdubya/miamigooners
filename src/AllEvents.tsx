import { Container, Box, Typography } from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import { Event } from "./Event";
import { DateTime } from "luxon";

export interface EventType {
	type: string;
	date: DateTime;
	title: string;
	location: string;
	rsvpLink?: string;
	img?: string;
	bgPosition?: string;
}

const events: EventType[] = [
	{
		type: "Europa League",
		date: DateTime.fromISO("2023-03-16T16:00:00"),
		title: "Arsenal vs Sporting CP",
		location: "Lost Boy, Dry Goods",
		img: "/images/random/891E46C3-606F-4B57-BC5C-4413BCE8E4C5.jpg",
		bgPosition: "0 -25px",
	},
	{
		type: "Premier League",
		date: DateTime.fromISO("2023-03-12T10:00:00"),
		title: "Arsenal vs Fulham",
		location: "Fritz and Franz",
		rsvpLink:
			"https://www.eventbrite.com/e/arsenal-v-fulham-watch-with-the-miami-gooners-tickets-582387906907",
		img: "/images/random/DSC02352.jpg",
		bgPosition: "0 -56px",
	},
	{
		type: "Europa League",
		date: DateTime.fromISO("2023-03-09T12:45:00"),
		title: "Arsenal vs Sporting CP",
		location: "Lost Boy, Dry Goods",
		rsvpLink:
			"https://www.eventbrite.com/e/arsenal-v-everton-watch-with-the-miami-gooners-tickets-566559092497",
		img: "/images/random/IMG_1430.jpg",
		bgPosition: "0 -50px",
	},
	{
		type: "Premier League",
		date: DateTime.fromISO("2023-03-04T10:00:00"),
		title: "Arsenal vs Bournemouth",
		location: "Fritz and Franz",
		rsvpLink:
			"https://www.eventbrite.com/e/arsenal-v-everton-watch-with-the-miami-gooners-tickets-566559092497",
		img: "/images/vs-bournemouth.jpeg",
		bgPosition: "0 -44px",
	},
	{
		type: "Premier League",
		date: DateTime.fromISO("2023-03-01T14:45:00"),
		title: "Arsenal vs Everton",
		location: "Lost Boy, Dry Goods",
		rsvpLink:
			"https://www.eventbrite.com/e/arsenal-v-everton-watch-with-the-miami-gooners-tickets-566559092497",
		img: "/images/vs-everton.jpg",
		bgPosition: "0 -21px",
	},
	{
		type: "Premier League",
		date: DateTime.fromISO("2023-02-25T10:00:00"),
		title: "Arsenal vs Leicester",
		location: "Fritz and Franz",
		rsvpLink:
			"https://www.eventbrite.com/e/arsenal-v-everton-watch-with-the-miami-gooners-tickets-566559092497",
		img: "/images/vs-leicester.jpg",
	},
];

export const AllEvents = () => {
	return (
		<Container>
			<Box component='div' mb={8}>
				<Typography variant='h3' gutterBottom color={"primary"} mt={4}>
					Upcoming Events
				</Typography>

				<Grid container spacing={2} mt={2}>
					{events
						.filter((val) => val.date.toISODate() > DateTime.now().toISODate())
						.sort((a, b) => a.date.toMillis() - b.date.toMillis())
						.map((event, index) => (
							<Event key={index} event={event} />
						))}
				</Grid>

				<Typography variant='h3' gutterBottom color={"primary"} mt={4}>
					Past Events
				</Typography>

				<Grid container spacing={2} mt={2}>
					{events
						.filter((val) => val.date.toISODate() < DateTime.now().toISODate())
						.map((event, index) => (
							<Event key={index} event={event} past={true} />
						))}
				</Grid>
			</Box>
		</Container>
	);
};
