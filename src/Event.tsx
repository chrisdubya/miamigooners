import {
	Button,
	Card,
	CardActions,
	CardContent,
	CardMedia,
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
	const formatDuration = (date: DateTime) => {
		const duration = Math.ceil(
			date.diffNow().shiftTo("days").toObject().days as number
		);

		return duration > 1 ? `${duration} days` : `${duration} day`;
	};

	return (
		<Grid xs={12} md={6}>
			<Card sx={{ minWidth: 275, position: "relative" }}>
				{!past && (
					<Typography
						sx={{
							position: "absolute",
							top: "1rem",
							right: "1rem",
							fontWeight: "700",
						}}
						variant='h5'
						color={"primary"}>
						{formatDuration(event.date)}
					</Typography>
				)}
				<CardMedia
					sx={{ height: 140 }}
					image={`https://picsum.photos/300/300?grayscale&random=${
						Math.floor(Math.random() * 10) + 1
					}`}
					title={event.title}
				/>
				<CardContent>
					<Typography sx={{ fontSize: 14 }} color='text.secondary' gutterBottom>
						{event.type}
					</Typography>
					<Typography variant='h5' component='div'>
						{event.title}
					</Typography>
					<Typography sx={{ mb: 1.5 }} color='text.secondary'>
						{event.date.toFormat("EEEE, M/d h:mma")}
					</Typography>
					<Typography variant='body2'>{event.location}</Typography>
				</CardContent>

				<CardActions>
					<Button disabled={past} href={event.rsvpLink} size='small'>
						RSVP {past && "closed"}
					</Button>
				</CardActions>
			</Card>
		</Grid>
	);
};
