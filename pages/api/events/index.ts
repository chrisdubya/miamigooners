import {EventType} from '../../../types'
import fs from 'fs'
import path from 'path'

export default async function handler(req: any, res: any) {
  if (req.method === 'GET') {
    try {
      const preSeason25: EventType[] = [
        {
          MatchNumber: 1,
          RoundNumber: 1,
          DateUtc: '2025-08-09 16:00:00Z',
          Location: 'Emirates Stadium',
          HomeTeam: 'Arsenal',
          AwayTeam: 'Athletic Club',
          competition: 'Emirates Cup',
        },
      ]

      const fixturesPath = path.join(process.cwd(), 'public', 'fixtures', 'premier-league-25-26.json')
      const fixturesData = fs.readFileSync(fixturesPath, 'utf8')
      const plSeason25: EventType[] = JSON.parse(fixturesData).map((event: EventType) => {
        return {competition: 'Premier League', ...event}
      })

      const allMatches = [...preSeason25, ...plSeason25]

      res.status(200).json(allMatches)
    } catch (e) {
      console.error(e)
      res.status(500).json({error: 'Error fetching match details'})
    }
  }
}
