import {
	Button,
	Card,
	CardActions,
	CardContent,
	Typography,
} from "@mui/material";
import { EventType } from "./AllEvents";
import Grid from "@mui/material/Unstable_Grid2";

interface EventProps {
	event: EventType;
}

export const Event = ({ event }: EventProps) => {
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
						{event.date}
					</Typography>
					<Typography variant='body2'>{event.location}</Typography>
				</CardContent>
				{event.rsvpLink && (
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
