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
      // https://fixturedownload.com/feed/json/epl-2025/arsenal
      const eplFixturesPath = path.join(process.cwd(), 'public', 'fixtures', 'premier-league-25-26.json')
      // https://fixturedownload.com/feed/json/champions-league-2025/arsenal
      const uclFixturesPath = path.join(process.cwd(), 'public', 'fixtures', 'ucl-25-26.json')
      const carabaoCupFixturesPath = path.join(process.cwd(), 'public', 'fixtures', 'carabao-cup-25-26.json')
      const eplFixturesData = fs.readFileSync(eplFixturesPath, 'utf8')
      const uclFixturesData = fs.readFileSync(uclFixturesPath, 'utf8')
      const carabaoCupFixturesData = fs.readFileSync(carabaoCupFixturesPath, 'utf8')
      const plSeason25: EventType[] = JSON.parse(eplFixturesData).map((event: EventType) => {
        return {competition: 'Premier League', ...event}
      })
      const uclSeason25: EventType[] = JSON.parse(uclFixturesData).map((event: EventType) => {
        return {competition: 'UEFA Champions League', ...event}
      })
      const carabaoCupSeason25: EventType[] = JSON.parse(carabaoCupFixturesData).map((event: EventType) => {
        return {competition: 'Carabao Cup', ...event}
      })

      const allMatches = [...preSeason25, ...plSeason25, ...uclSeason25, ...carabaoCupSeason25].sort((a, b) => {
        return new Date(a.DateUtc).getTime() - new Date(b.DateUtc).getTime()
      })

      res.status(200).json(allMatches)
    } catch (e) {
      console.error(e)
      res.status(500).json({error: 'Error fetching match details'})
    }
  }
}
