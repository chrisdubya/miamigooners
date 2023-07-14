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
	competition?: string;
	rsvpLink?: string;
}
