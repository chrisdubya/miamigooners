import {EventType} from '../../types'
import fs from 'fs'
import path from 'path'

const EPL_URL = 'https://fixturedownload.com/feed/json/epl-2025/arsenal'
const UCL_URL =
  'https://fixturedownload.com/feed/json/champions-league-2025/arsenal'

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

export async function getAllEvents(): Promise<EventType[]> {
  const carabaoCupFixturesPath = path.join(
    process.cwd(),
    'public',
    'fixtures',
    'carabao-cup-25-26.json'
  )
  const faCupFixturesPath = path.join(
    process.cwd(),
    'public',
    'fixtures',
    'fa-cup-25-26.json'
  )

  const [plResult, uclResult] = await Promise.allSettled([
    fetch(EPL_URL, {next: {revalidate: 3600}}).then((r) => r.json()),
    fetch(UCL_URL, {next: {revalidate: 3600}}).then((r) => r.json()),
  ])

  const plSeason25: EventType[] = (
    plResult.status === 'fulfilled' ? plResult.value : []
  ).map((event: EventType) => ({competition: 'Premier League', ...event}))

  const uclSeason25: EventType[] = (
    uclResult.status === 'fulfilled' ? uclResult.value : []
  ).map((event: EventType) => ({competition: 'UEFA Champions League', ...event}))

  const carabaoCupSeason25: EventType[] = JSON.parse(
    fs.readFileSync(carabaoCupFixturesPath, 'utf8')
  ).map((event: EventType) => ({competition: 'Carabao Cup', ...event}))

  const faCupSeason25: EventType[] = JSON.parse(
    fs.readFileSync(faCupFixturesPath, 'utf8')
  ).map((event: EventType) => ({competition: 'FA Cup', ...event}))

  return [
    ...preSeason25,
    ...plSeason25,
    ...uclSeason25,
    ...carabaoCupSeason25,
    ...faCupSeason25,
  ].sort(
    (a, b) => new Date(a.DateUtc).getTime() - new Date(b.DateUtc).getTime()
  )
}
