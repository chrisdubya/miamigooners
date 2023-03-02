import axios from "axios";

export default async function handler(req: any, res: any) {
	if (req.method === "GET") {
		try {
			const response = await axios.get(
				"https://fixturedownload.com/feed/json/epl-2022/arsenal"
			);

			if (response.status !== 200) {
				throw new Error("error fetching match details");
			}

			res.status(200).json(response.data);
		} catch (e) {
			console.error(e);
			res.status(500).json({ error: "Error fetching match details" });
		}
	}
}
