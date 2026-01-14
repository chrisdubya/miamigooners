import {Box} from '@mui/material'

import {AllEvents} from '../src/AllEvents'
import {GetServerSideProps} from 'next'
import {EventType} from '../types'
import {getBaseUrl} from '../src/utils/env'
import {Footer} from '../src/Footer'
import {Hero} from '../src/Hero'
import {SEO, generateEventSchema} from '../src/SEO'

export const getServerSideProps = (async () => {
  try {
    const res = await fetch(`${getBaseUrl()}/api/events`)
    const events: EventType[] = await res.json()

    return {props: {events: events}}
  } catch (error) {
    return {props: {events: []}}
  }
}) satisfies GetServerSideProps<{events: EventType[]}>

export default function Home({events}: {events: EventType[]}) {
  // Get upcoming events (future dates only) for structured data
  const now = new Date()
  const upcomingEvents = events
    .filter((event) => new Date(event.DateUtc) > now)
    .slice(0, 5) // Limit to next 5 events

  // Generate event schemas for upcoming matches
  const eventSchemas = upcomingEvents.map((event) =>
    generateEventSchema({
      name: `${event.HomeTeam} vs ${event.AwayTeam}${event.competition ? ` - ${event.competition}` : ''}`,
      description: `Watch ${event.HomeTeam} vs ${event.AwayTeam} with Miami Gooners at The Bar Gables. ${event.competition || 'Arsenal match'} watch party.`,
      startDate: event.DateUtc,
      location: {
        name: 'The Bar Gables',
        address: 'Miami, FL',
      },
    })
  )

  return (
    <>
      <SEO
        title="Miami Gooners - Official Arsenal FC Supporters Club in Miami, FL"
        description="Miami Gooners: Official Arsenal FC Supporters Club. We watch all matches @thebargables. Join us for match days, events, and official merchandise."
        url="/"
        jsonLd={eventSchemas.length > 0 ? eventSchemas : undefined}
      />

      <Hero />

      <Box component="div">
        <AllEvents events={events} />

        <Footer />
      </Box>
    </>
  )
}
