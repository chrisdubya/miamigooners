import axios from "axios";

export default async function handler(req: any, res: any) {
	if (req.method === "GET") {
		try {
			const response22 = await axios.get(
				"https://fixturedownload.com/feed/json/epl-2022/arsenal"
			);

			const response23 = await axios.get(
				"https://fixturedownload.com/feed/json/epl-2023/arsenal"
			);

			if (response22.status !== 200 || response23.status !== 200) {
				throw new Error("error fetching match details");
			}

			const response = response22.data.concat(response23.data);

			res.status(200).json(response);
		} catch (e) {
			console.error(e);
			res.status(500).json({ error: "Error fetching match details" });
		}
	}
}
