import {Suspense} from 'react'
import type {Metadata} from 'next'
import {getMatchPhotos} from '../../src/utils/googleDrive'
import {getAllEvents} from '../../src/utils/events'
import PhotosContent from './PhotosContent'
import type {MatchFolder} from '../../src/types/photos'

export const metadata: Metadata = {
  title: 'Matchday Photos - Miami Gooners | Arsenal Watch Party Photos in Miami',
  description:
    'Browse matchday photos from Miami Gooners Arsenal watch parties at The Bar in Coral Gables, FL. Thousands of photos from Premier League, Champions League, FA Cup, and Carabao Cup matchdays.',
  alternates: {canonical: 'https://miamigooners.com/matchday-photos'},
  openGraph: {
    type: 'website',
    url: 'https://miamigooners.com/matchday-photos',
    title: 'Matchday Photos - Miami Gooners',
    description:
      'Browse matchday photos from Miami Gooners Arsenal watch parties at The Bar in Coral Gables, FL.',
    images: ['https://miamigooners.com/og-image.jpg'],
    siteName: 'Miami Gooners',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Matchday Photos - Miami Gooners',
    description:
      'Browse matchday photos from Miami Gooners Arsenal watch parties at The Bar in Coral Gables, FL.',
    images: ['https://miamigooners.com/og-image.jpg'],
  },
}

// Normalize team names so UCL API names match Drive folder names
const teamNameAliases: Record<string, string> = {
  'bayern münchen': 'bayern munich',
  'atleti': 'atletico madrid',
}

function normalizeTeam(name: string): string {
  const lower = name.toLowerCase()
  return teamNameAliases[lower] ?? lower
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
        normalizeTeam(opp) === normalizeTeam(match.opponent) &&
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

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Matchday Photos - Miami Gooners',
    description:
      'Photos from Miami Gooners Arsenal watch parties at The Bar in Coral Gables, FL.',
    url: 'https://miamigooners.com/matchday-photos',
    isPartOf: {
      '@type': 'WebSite',
      name: 'Miami Gooners',
      url: 'https://miamigooners.com',
    },
    about: {
      '@type': 'SportsClub',
      name: 'Miami Gooners',
    },
    numberOfItems: data.stats.totalFiles,
  }

  return (
    <>
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{__html: JSON.stringify(jsonLd)}}
      />
      <Suspense>
        <PhotosContent data={{...data, matches: enrichedMatches}} />
      </Suspense>
    </>
  )
}
