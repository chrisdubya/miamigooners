import {EventType} from '../../../types'

export default async function handler(req: any, res: any) {
  if (req.method === 'GET') {
    try {
      const preSeason24: EventType[] = [
        {
          MatchNumber: 1,
          RoundNumber: 1,
          DateUtc: '2024-07-28 00:00:00Z',
          Location: 'SoFi Stadium',
          HomeTeam: 'Arsenal',
          AwayTeam: 'Man Utd',
          competition: 'Pre-season Friendly',
        },
        {
          MatchNumber: 2,
          RoundNumber: 1,
          DateUtc: '2024-07-31 23:30:00Z',
          Location: 'Lincoln Financial Field',
          HomeTeam: 'Liverpool',
          AwayTeam: 'Arsenal',
          competition: 'Pre-season Friendly',
        },
      ]

      const plSeason24Response = await fetch(
        'https://fixturedownload.com/feed/json/epl-2024/arsenal'
      )

      if (!plSeason24Response.ok) {
        throw new Error('Error fetching match details')
      }

      const plSeason24: EventType[] = await plSeason24Response.json()
        .then((seasonArray) => {
          return seasonArray.map((event: EventType) => {
            return {competition: 'Premier League', ...event}
          })
        })

      const fullSeason24 = plSeason24.concat(preSeason24)

      res.status(200).json(fullSeason24)
    } catch (e) {
      console.error(e)
      res.status(500).json({error: 'Error fetching match details'})
    }
  }
}
