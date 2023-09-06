export interface EventType {
	MatchNumber: number;
	RoundNumber: number;
	DateUtc: string;
	Location: string;
	HomeTeam: string;
	AwayTeam: string;
	Group?: string;
	HomeTeamScore?: number;
	AwayTeamScore?: number;
	image?: string;
	competition?: "Pre-season Friendly" | "Emirates Cup" | "Premier League" | "FA Cup" | "Carabao Cup" | "Europa League" | "UEFA Champions League" | "FA Community Shield" | "Other";
	rsvpLink?: string;
	winnerOnPenalties?: string;
}
