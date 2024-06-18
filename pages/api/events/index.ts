import {EventType} from '../../../types'

export default async function handler(req: any, res: any) {
  if (req.method === 'GET') {
    try {
      const preseason24: EventType[] = [
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

      const season24 = await fetch(
        'https://fixturedownload.com/feed/json/epl-2024/arsenal'
      )

      if (!season24.ok) {
        throw new Error('Error fetching match details')
      }

      const season24Json: EventType[] = await season24.json()
      const season24WithPreseason = season24Json.concat(preseason24)

      res.status(200).json(season24WithPreseason)
    } catch (e) {
      console.error(e)
      res.status(500).json({error: 'Error fetching match details'})
    }
  }
}
