import axios from "axios";
import { EventType } from "../../../types";

export default async function handler(req: any, res: any) {
	if (req.method === "GET") {
		try {
			const response22 = await axios.get(
				"https://fixturedownload.com/feed/json/epl-2022/arsenal"
			);

			const response23 = await axios.get(
				"https://fixturedownload.com/feed/json/epl-2023/arsenal"
			);

			const preseason23: EventType[] = [
				{
					MatchNumber: 1,
					RoundNumber: 1,
					DateUtc: "2023-07-13 17:00:00Z",
					Location: "Max-Morlock-Stadion",
					HomeTeam: "FC Nürnberg",
					AwayTeam: "Arsenal",
					competition: "Pre-season Friendly",
					HomeTeamScore: 1,
					AwayTeamScore: 1,
				},
				{
					MatchNumber: 2,
					RoundNumber: 1,
					DateUtc: "2023-07-20 00:30:00Z",
					Location: "Audi Field",
					HomeTeam: "MLS All-Stars",
					AwayTeam: "Arsenal",
					competition: "Pre-season Friendly",
					rsvpLink:
						"https://www.eventbrite.com/e/arsenal-vs-mls-all-stars-watch-party-with-the-miami-gooners-tickets-678283693787?aff=oddtdtcreator",
					HomeTeamScore: 0,
					AwayTeamScore: 5,
				},
				{
					MatchNumber: 3,
					RoundNumber: 1,
					DateUtc: "2023-07-22 21:00:00Z",
					Location: "MetLife Stadium",
					HomeTeam: "Arsenal",
					AwayTeam: "Man Utd",
					competition: "Pre-season Friendly",
					rsvpLink:
						"https://www.eventbrite.com/e/arsenal-vs-manchester-united-watch-party-with-the-miami-gooners-tickets-679510132097?aff=oddtdtcreator",
					HomeTeamScore: 0,
					AwayTeamScore: 2,
				},
				{
					MatchNumber: 3,
					RoundNumber: 1,
					DateUtc: "2023-07-27 02:30:00Z",
					Location: "SoFi Stadium",
					HomeTeam: "Arsenal",
					AwayTeam: "Barcelona",
					competition: "Pre-season Friendly",
					HomeTeamScore: 5,
					AwayTeamScore: 3,
				},
				{
					MatchNumber: 1,
					RoundNumber: 1,
					DateUtc: "2023-08-02 17:00:00Z",
					Location: "Emirates Stadium",
					HomeTeam: "Arsenal",
					AwayTeam: "Monaco",
					competition: "Emirates Cup",
					HomeTeamScore: 1,
					AwayTeamScore: 1,
					winnerOnPenalties: "Arsenal",
				},
				{
					MatchNumber: 1,
					RoundNumber: 1,
					DateUtc: "2023-08-06 15:00:00Z",
					Location: "Wembley Stadium",
					HomeTeam: "Arsenal",
					AwayTeam: "Man City",
					competition: "FA Community Shield",
					HomeTeamScore: 1,
					AwayTeamScore: 1,
					winnerOnPenalties: "Arsenal",
					rsvpLink:
						"https://www.eventbrite.com/e/arsenal-vs-man-city-watch-party-with-the-miami-gooners-tickets-690106897307?aff=oddtdtcreator",
				},
			];

			if (response22.status !== 200 || response23.status !== 200) {
				throw new Error("error fetching match details");
			}

			const season23Additions: Partial<EventType>[] = [
				{
					MatchNumber: 2,
					rsvpLink: 'https://www.eventbrite.com/e/arsenal-vs-nottingham-forest-watch-party-with-the-miami-gooners-tickets-694262145767?aff=oddtdtcreator'
				}
			]

			const updatedResponse23Data = response23.data.map((match: EventType) => {
				const addition = season23Additions.find((addition) => addition.MatchNumber === match.MatchNumber);
				return addition ? { ...match, ...addition } : match;
			});

			const response = response22.data.concat(updatedResponse23Data);

			const responseWithPreseason = response.concat(preseason23);

			res.status(200).json(responseWithPreseason);
		} catch (e) {
			console.error(e);
			res.status(500).json({ error: "Error fetching match details" });
		}
	}
}
