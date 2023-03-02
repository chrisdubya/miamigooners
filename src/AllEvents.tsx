import Grid from "@mui/material/Unstable_Grid2";
import { Event } from "./Event";

export interface EventType {
	type: string;
	date: string;
	title: string;
	location: string;
	rsvpLink?: string;
}

const events: EventType[] = [
	{
		type: "Watch Party",
		date: "03/04/2023",
		title: "Arsenal vs Bournemouth",
		location: "Fritz and Franz",
	},
	{
		type: "Watch Party",
		date: "03/02/2023",
		title: "Arsenal vs Everton",
		location: "Lost Boy, Dry Goods",
		rsvpLink:
			"https://www.eventbrite.com/e/arsenal-v-everton-watch-with-the-miami-gooners-tickets-566559092497",
	},
];

export const AllEvents = () => {
	return (
		<Grid container spacing={2}>
			{events.map((event, index) => (
				<Event key={index} event={event} />
			))}
		</Grid>
	);
};
