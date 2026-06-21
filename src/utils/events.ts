import {EventType} from '../../types'
import fs from 'fs'
import path from 'path'

const EPL_URLS = [
  'https://fixturedownload.com/feed/json/epl-2025/arsenal',
  'https://fixturedownload.com/feed/json/epl-2026/arsenal',
]
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
  {
    MatchNumber: 2,
    RoundNumber: 1,
    DateUtc: '2026-08-05 18:30:00Z',
    Location: 'Aviva Stadium',
    HomeTeam: 'Arsenal',
    AwayTeam: 'Real Betis',
    competition: 'Pre-season Friendly',
  },
]

const communityShield26: EventType[] = [
  {
    MatchNumber: 1,
    RoundNumber: 1,
    DateUtc: '2026-08-16 14:00:00Z',
    Location: 'Principality Stadium',
    HomeTeam: 'Arsenal',
    AwayTeam: 'Man City',
    competition: 'FA Community Shield',
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

  const [uclResult, ...plResults] = await Promise.allSettled([
    fetch(UCL_URL, {next: {revalidate: 3600}}).then((r) => r.json()),
    ...EPL_URLS.map((url) =>
      fetch(url, {next: {revalidate: 3600}}).then((r) => r.json())
    ),
  ])

  const plSeason25: EventType[] = plResults
    .flatMap((result) => (result.status === 'fulfilled' ? result.value : []))
    .map((event: EventType) => ({competition: 'Premier League', ...event}))

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
    ...communityShield26,
    ...plSeason25,
    ...uclSeason25,
    ...carabaoCupSeason25,
    ...faCupSeason25,
  ].sort(
    (a, b) => new Date(a.DateUtc).getTime() - new Date(b.DateUtc).getTime()
  )
}
