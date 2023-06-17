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
import { teamColors } from "./constants/teamColors";

interface EventProps {
	index: number;
	event: EventType;
	past?: boolean;
}

export const Event = ({ index, event, past }: EventProps) => {
	const [isHovering, setIsHovering] = useState<boolean>(false);

	const formatDuration = (date: string) => {
		const futureDate = DateTime.fromFormat(date, "yyyy-MM-dd HH:mm:ss'Z'", {
			zone: "utc",
		});
		const currentDate = DateTime.now();
		const diff = futureDate.diff(currentDate, "days").toObject();

		if (diff?.days) {
			const daysDifference = Math.ceil(diff.days);

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

	const getTeamColor = (
		event: EventType,
		colorType: "primary" | "secondary"
	) => {
		const team = event.HomeTeam === "Arsenal" ? event.AwayTeam : event.HomeTeam;
		const color = teamColors.find((item) => item.team === team);

		return colorType === "primary" ? color?.primary : color?.secondary;
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
						color={"white"}>
						{formatDuration(event.DateUtc)}
					</Typography>
				)}

				<CardMedia
					onMouseEnter={() => setIsHovering(true)}
					onMouseLeave={() => setIsHovering(false)}
					sx={{
						position: "relative",
						height: 140,
						backgroundColor: getTeamColor(event, "primary"),
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
							color: getTeamColor(event, "secondary"),
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
