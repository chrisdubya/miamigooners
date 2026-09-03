import {EventType} from '../../types'
import fs from 'fs'
import path from 'path'

const EPL_URLS = [
  'https://fixturedownload.com/feed/json/epl-2025/arsenal',
  'https://fixturedownload.com/feed/json/epl-2026/arsenal',
]
const UCL_URLS = [
  'https://fixturedownload.com/feed/json/champions-league-2025/arsenal',
  'https://fixturedownload.com/feed/json/champions-league-2026/arsenal',
]

const CARABAO_CUP_FILES = ['carabao-cup-25-26.json', 'carabao-cup-26-27.json']
const FA_CUP_FILES = ['fa-cup-25-26.json', 'fa-cup-26-27.json']

const preSeason: EventType[] = [
  {
    MatchNumber: 1,
    RoundNumber: 1,
    DateUtc: '2025-08-09 16:00:00Z',
    Location: 'Emirates Stadium',
    HomeTeam: 'Arsenal',
    AwayTeam: 'Athletic Club',
    HomeTeamScore: 3,
    AwayTeamScore: 0,
    competition: 'Emirates Cup',
  },
  {
    MatchNumber: 2,
    RoundNumber: 1,
    DateUtc: '2026-08-01 18:00:00Z',
    Location: 'Estadi Montilivi',
    HomeTeam: 'Girona',
    AwayTeam: 'Arsenal',
    HomeTeamScore: 1,
    AwayTeamScore: 4,
    competition: 'Pre-season Friendly',
  },
  {
    MatchNumber: 3,
    RoundNumber: 1,
    DateUtc: '2026-08-05 18:30:00Z',
    Location: 'Aviva Stadium',
    HomeTeam: 'Arsenal',
    AwayTeam: 'Real Betis',
    HomeTeamScore: 1,
    AwayTeamScore: 3,
    competition: 'Pre-season Friendly',
  },
  {
    MatchNumber: 4,
    RoundNumber: 1,
    DateUtc: '2026-08-09 13:00:00Z',
    Location: 'Emirates Stadium',
    HomeTeam: 'Arsenal',
    AwayTeam: 'Borussia Dortmund',
    HomeTeamScore: 2,
    AwayTeamScore: 3,
    competition: 'Emirates Cup',
  },
  {
    MatchNumber: 5,
    RoundNumber: 1,
    DateUtc: '2026-08-12 18:30:00Z',
    Location: 'Emirates Stadium',
    HomeTeam: 'Arsenal',
    AwayTeam: 'Como',
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
    HomeTeamScore: 3,
    AwayTeamScore: 0,
    competition: 'FA Community Shield',
  },
]

function readLocalFixtures(files: string[]): EventType[] {
  return files.flatMap((file) =>
    JSON.parse(
      fs.readFileSync(
        path.join(process.cwd(), 'public', 'fixtures', file),
        'utf8'
      )
    )
  )
}

export async function getAllEvents(): Promise<EventType[]> {
  const [plResults, uclResults] = await Promise.all(
    [EPL_URLS, UCL_URLS].map((urls) =>
      Promise.allSettled(
        urls.map((url) =>
          fetch(url, {next: {revalidate: 3600}}).then((r) => r.json())
        )
      )
    )
  )

  const premierLeague: EventType[] = plResults
    .flatMap((result) => (result.status === 'fulfilled' ? result.value : []))
    .map((event: EventType) => ({competition: 'Premier League', ...event}))

  const championsLeague: EventType[] = uclResults
    .flatMap((result) => (result.status === 'fulfilled' ? result.value : []))
    .map((event: EventType) => ({competition: 'UEFA Champions League', ...event}))

  const carabaoCup: EventType[] = readLocalFixtures(CARABAO_CUP_FILES).map(
    (event: EventType) => ({competition: 'Carabao Cup', ...event})
  )

  const faCup: EventType[] = readLocalFixtures(FA_CUP_FILES).map(
    (event: EventType) => ({competition: 'FA Cup', ...event})
  )

  return [
    ...preSeason,
    ...communityShield26,
    ...premierLeague,
    ...championsLeague,
    ...carabaoCup,
    ...faCup,
  ].sort(
    (a, b) => new Date(a.DateUtc).getTime() - new Date(b.DateUtc).getTime()
  )
}
