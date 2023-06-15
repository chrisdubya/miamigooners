import { useMemo, useState } from "react";
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
	const [isHovering, setIsHovering] = useState<boolean>(false);
	const formatDuration = (date: string) => {
		// Create a Luxon DateTime object from the futureDate string
		const futureDate = DateTime.fromFormat(date, "yyyy-MM-dd HH:mm:ss'Z'", {
			zone: "utc",
		});

		// Get the current date
		const currentDate = DateTime.now();

		// Calculate the difference in days
		const diff = futureDate.diff(currentDate, "days").toObject();

		if (diff?.days) {
			const daysDifference = Math.ceil(diff.days);

			// Display the number of days
			console.log("Number of days from now:", daysDifference);

			return daysDifference > 1
				? `${daysDifference} days`
				: `${daysDifference} day`;
		}
	};

	const formattedDateTime = useMemo(() => {
		const format = "yyyy-MM-dd HH:mm:ss'Z'";
		const dateTime = DateTime.fromFormat(event.DateUtc, format, {
			zone: "utc",
		}).setZone("America/New_York");
		return dateTime.toFormat("EEEE, M/d h:mma");
	}, [event.DateUtc]);

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
						{formatDuration(event.DateUtc)}
					</Typography>
				)}
				<CardMedia
					onMouseEnter={() => setIsHovering(true)}
					onMouseLeave={() => setIsHovering(false)}
					sx={{
						height: 140,
						filter: isHovering ? "grayscale(0%)" : "grayscale(100%)",
					}}
					image={past ? event.image ?? undefined : undefined}>
					<Typography
						variant='h4'
						component='div'
						sx={{
							position: "absolute",
							top: "50%",
							left: "50%",
							transform: "translate(-50%, -50%)",
						}}>
						{event.AwayTeam === "Arsenal"
							? `${event.HomeTeam.toUpperCase()}[A]`
							: `${event.AwayTeam.toUpperCase()}[H]`}
					</Typography>
				</CardMedia>
				<CardContent>
					{event?.HomeTeamScore?.toString() &&
						event?.AwayTeamScore?.toString() && (
							<Typography
								sx={{ fontSize: 14 }}
								color='text.secondary'
								gutterBottom>
								{event.AwayTeamScore} - {event.HomeTeamScore}
							</Typography>
						)}
					<Typography sx={{ mb: 1.5 }} color='text.secondary'>
						{formattedDateTime}
					</Typography>
					<Typography variant='body2'>{event.Location}</Typography>
				</CardContent>

				{/* {event.rsvpLink && (
					<CardActions>
						<Button disabled={past} href={event.rsvpLink} size='small'>
							RSVP {past && "closed"}
						</Button>
					</CardActions>
				)} */}
			</Card>
		</Grid>
	);
};
