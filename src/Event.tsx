import {
	Button,
	Card,
	CardActions,
	CardContent,
	Typography,
} from "@mui/material";
import { EventType } from "./AllEvents";
import Grid from "@mui/material/Unstable_Grid2";
import { DateTime } from "luxon";

interface EventProps {
	event: EventType;
	past?: boolean;
}

export const Event = ({ event, past }: EventProps) => {
	console.log(event);
	return (
		<Grid xs={12} md={6}>
			<Card sx={{ minWidth: 275 }}>
				<CardContent>
					<Typography sx={{ fontSize: 14 }} color='text.secondary' gutterBottom>
						{event.type}
					</Typography>
					<Typography variant='h5' component='div'>
						{event.title}
					</Typography>
					<Typography sx={{ mb: 1.5 }} color='text.secondary'>
						{event.date.toISODate()}
					</Typography>
					<Typography variant='body2'>{event.location}</Typography>
				</CardContent>
				{event.rsvpLink && !past && (
					<CardActions>
						<Button href={event.rsvpLink} size='small'>
							RSVP
						</Button>
					</CardActions>
				)}
			</Card>
		</Grid>
	);
};
