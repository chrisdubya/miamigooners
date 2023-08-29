import { useEffect, useMemo } from "react";
import {
	Box,
	Button,
	Card,
	CardActions,
	CardContent,
	CardMedia,
	Typography,
} from "@mui/material";
import { EventType } from "../types";
import Grid from "@mui/material/Unstable_Grid2";
import { DateTime } from "luxon";
import { teamColors } from "./constants/teamColors";

interface EventProps {
	index: number;
	event: EventType;
	past?: boolean;
}

export const Event = ({ index, event, past }: EventProps) => {
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
				: daysDifference <= 0
				? "Today"
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

	const getCountdownColor = (event: EventType) => {
		if (
			getTeamColor(event, "primary") === "#fff" ||
			getTeamColor(event, "primary") === "rgba(255,255,255,1)"
		) {
			return "#000";
		} else {
			return "#fff";
		}
	};

	const renderScore = (homeTeamScore: number, awayTeamScore: number) => {
		const winLossOrDraw = (arsScore: number, oppScore: number) => {
			if (arsScore > oppScore) {
				return "W";
			} else if (arsScore < oppScore) {
				return "L";
			} else if (arsScore === oppScore) {
				if (!event.winnerOnPenalties) {
					return "D";
				} else if (event.winnerOnPenalties === "Arsenal") {
					return "W (P)";
				} else {
					return "L (P)";
				}
			}
		};

		if (event.AwayTeam === "Arsenal") {
			const wLD = winLossOrDraw(awayTeamScore, homeTeamScore);
			return `${wLD} ${awayTeamScore} - ${homeTeamScore}`;
		} else {
			const wLD = winLossOrDraw(homeTeamScore, awayTeamScore);
			return `${wLD} ${homeTeamScore} - ${awayTeamScore}`;
		}
	};

	return (
		<Grid xs={12} md={6}>
			<Card sx={{ minWidth: 275, position: "relative" }}>
				{event.rsvpLink && !past && (
					<CardActions sx={{ position: "absolute", zIndex: 1 }}>
						<Button
							disabled={past}
							href={event.rsvpLink}
							size='large'
							variant='outlined' sx={{ 
								color: 
									getTeamColor(event, "primary") === 'rgba(221,0,0,1)' 
									? '#fff' 
									: getTeamColor(event, "primary") === 'rgba(218,41,28,1)' 
									? '#fff' 
									: null, 
								borderColor: 
									getTeamColor(event, "primary") === 'rgba(221,0,0,1)' 
									? '#fff' 
									: getTeamColor(event, "primary") === 'rgba(218,41,28,1)' 
									? '#fff' 
									: null
						}}>
							RSVP
						</Button>
					</CardActions>
				)}
				{!past && (
					<Typography
						sx={{
							position: "absolute",
							top: "1rem",
							right: "1rem",
							fontWeight: "700",
							zIndex: 1,
							fontSize: { sm: "1rem", md: "1.25rem" },
						}}
						color={getCountdownColor(event)}>
						{formatDuration(event.DateUtc)}
					</Typography>
				)}

				<CardMedia
					sx={{
						position: "relative",
						height: 140,
						backgroundImage:
							past && event.image
								? `linear-gradient(black, black), url(${event.image})`
								: undefined,
						backgroundBlendMode: "saturation",
					}}>
					<Box
						component='div'
						sx={{
							position: "absolute",
							top: 0,
							left: 0,
							right: 0,
							bottom: 0,
							backgroundColor: getTeamColor(event, "primary"),
							opacity: past && event.image ? 0.7 : 1,
						}}></Box>
					<Typography
						variant='h4'
						component='div'
						sx={{
							fontWeight: "bold",
							position: "absolute",
							top: "50%",
							left: "50%",
							transform: "translate(-50%, -50%)",
							color: getTeamColor(event, "secondary"),
							fontSize: { xs: "1.5rem", md: "2.125rem" },
						}}>
						{event.AwayTeam === "Arsenal"
							? `${event.HomeTeam.toUpperCase()}[A]`
							: `${event.AwayTeam.toUpperCase()}[H]`}
					</Typography>
				</CardMedia>

				<CardContent>
					{event?.competition && (
						<Typography
							sx={{ fontSize: 14, fontStyle: "italic" }}
							color='text.secondary'
							gutterBottom>
							{event.competition}
						</Typography>
					)}
					{event?.HomeTeamScore?.toString() &&
						event?.AwayTeamScore?.toString() && (
							<Typography
								sx={{ fontSize: 14 }}
								color='text.secondary'
								gutterBottom>
								{renderScore(event?.HomeTeamScore, event?.AwayTeamScore)}
							</Typography>
						)}
					<Typography sx={{ mb: 1.5 }} color='text.secondary'>
						{formattedDateTime}
					</Typography>
					<Typography variant='body2'>{event.Location}</Typography>
				</CardContent>
			</Card>
		</Grid>
	);
};
