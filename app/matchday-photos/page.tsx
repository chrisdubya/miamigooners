import {Suspense} from 'react'
import type {Metadata} from 'next'
import {getMatchPhotos} from '../../src/utils/googleDrive'
import {getAllEvents} from '../../src/utils/events'
import PhotosContent from './PhotosContent'
import type {MatchFolder} from '../../src/types/photos'

export const metadata: Metadata = {
  title: 'Matchday Photos - Miami Gooners',
  description:
    'Browse matchday photos from Miami Gooners watch parties at The Bar in Coral Gables.',
  alternates: {canonical: 'https://miamigooners.com/matchday-photos'},
}

export default async function MatchdayPhotos() {
  const [data, events] = await Promise.all([
    getMatchPhotos(),
    getAllEvents().catch(() => []),
  ])

  // Enrich matches with event data (score, competition, result, home/away)
  const enrichedMatches: MatchFolder[] = data.matches.map((match) => {
    const event = events.find((e) => {
      const opp =
        e.AwayTeam === 'Arsenal' ? e.HomeTeam : e.AwayTeam
      const eventDate = e.DateUtc.split(' ')[0]
      return (
        opp.toLowerCase() === match.opponent.toLowerCase() &&
        eventDate === match.date
      )
    })

    if (!event) return match

    const isHome = event.AwayTeam !== 'Arsenal'
    const homeScore = event.HomeTeamScore
    const awayScore = event.AwayTeamScore
    const hasScore =
      homeScore !== undefined &&
      homeScore !== null &&
      awayScore !== undefined &&
      awayScore !== null

    let result = ''
    let score: string | null = null

    if (hasScore) {
      const arsScore = event.HomeTeam === 'Arsenal' ? homeScore : awayScore
      const oppScore = event.HomeTeam === 'Arsenal' ? awayScore : homeScore
      score = `${arsScore} - ${oppScore}`

      if (arsScore > oppScore) result = 'W'
      else if (arsScore < oppScore) result = 'L'
      else if (event.winnerOnPenalties === 'Arsenal') result = 'W'
      else if (event.winnerOnPenalties) result = 'L'
      else result = 'D'
    }

    return {
      ...match,
      competition: event.competition || match.competition,
      result,
      score,
      isHome,
    }
  })

  return (
    <Suspense>
      <PhotosContent data={{...data, matches: enrichedMatches}} />
    </Suspense>
  )
}
