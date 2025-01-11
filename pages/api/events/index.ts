import {EventType} from '../../../types'

export default async function handler(req: any, res: any) {
  if (req.method === 'GET') {
    try {
      const preSeason24: EventType[] = [
        {
          MatchNumber: 1,
          RoundNumber: 1,
          DateUtc: '2024-07-25 02:30:00Z',
          Location: 'Dignity Health Sports Park',
          HomeTeam: 'Arsenal',
          AwayTeam: 'Bournemouth',
          competition: 'Pre-season Friendly',
        },
        {
          MatchNumber: 2,
          RoundNumber: 1,
          DateUtc: '2024-07-28 00:00:00Z',
          Location: 'SoFi Stadium',
          HomeTeam: 'Arsenal',
          AwayTeam: 'Man Utd',
          competition: 'Pre-season Friendly',
        },
        {
          MatchNumber: 3,
          RoundNumber: 1,
          DateUtc: '2024-07-31 23:30:00Z',
          Location: 'Lincoln Financial Field',
          HomeTeam: 'Liverpool',
          AwayTeam: 'Arsenal',
          competition: 'Pre-season Friendly',
        },
      ]

      const faCup24 = [
        {
          MatchNumber: 1,
          RoundNumber: 3,
          DateUtc: '2025-01-12 15:00:00Z',
          Location: 'Emirates Stadium',
          HomeTeam: 'Arsenal',
          AwayTeam: 'Man Utd',
          competition: 'FA Cup',
        },
      ]

      const plSeason24Response = await fetch(
        'https://fixturedownload.com/feed/json/epl-2024/arsenal'
      )

      if (!plSeason24Response.ok) {
        throw new Error('Error fetching match details')
      }

      const championsLeagueResponse = await fetch(
        'https://fixturedownload.com/feed/json/champions-league-2024/arsenal'
      )

      const plSeason24: EventType[] = await plSeason24Response
        .json()
        .then((seasonArray) => {
          return seasonArray.map((event: EventType) => {
            return {competition: 'Premier League', ...event}
          })
        })

      const championsLeague: EventType[] = await championsLeagueResponse
        .json()
        .then((seasonArray) => {
          return seasonArray.map((event: EventType) => {
            return {competition: 'Champions League', ...event}
          })
        })

      const fullSeason24 = plSeason24.concat(
        preSeason24,
        faCup24,
        championsLeague
      )

      res.status(200).json(fullSeason24)
    } catch (e) {
      console.error(e)
      res.status(500).json({error: 'Error fetching match details'})
    }
  }
}
