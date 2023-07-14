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
				},
				{
					MatchNumber: 3,
					RoundNumber: 1,
					DateUtc: "2023-07-22 21:00:00Z",
					Location: "MetLife Stadium",
					HomeTeam: "Arsenal",
					AwayTeam: "Man Utd",
					competition: "Pre-season Friendly",
				},
				{
					MatchNumber: 3,
					RoundNumber: 1,
					DateUtc: "2023-07-27 02:30:00Z",
					Location: "SoFi Stadium",
					HomeTeam: "Arsenal",
					AwayTeam: "Barcelona",
					competition: "Pre-season Friendly",
				},
				{
					MatchNumber: 1,
					RoundNumber: 1,
					DateUtc: "2023-08-02 17:00:00Z",
					Location: "Emirates Stadium",
					HomeTeam: "Arsenal",
					AwayTeam: "Monaco",
					competition: "Emirates Cup",
				},
				{
					MatchNumber: 1,
					RoundNumber: 1,
					DateUtc: "2023-08-06 15:00:00Z",
					Location: "Emirates Stadium",
					HomeTeam: "Arsenal",
					AwayTeam: "Man City",
					competition: "FA Community Shield",
				},
			];

			if (response22.status !== 200 || response23.status !== 200) {
				throw new Error("error fetching match details");
			}

			const response = response22.data.concat(response23.data);

			const responseWithPreseason = response.concat(preseason23);

			res.status(200).json(responseWithPreseason);
		} catch (e) {
			console.error(e);
			res.status(500).json({ error: "Error fetching match details" });
		}
	}
}
