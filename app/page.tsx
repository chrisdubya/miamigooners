import {AllEvents} from '../src/AllEvents'
import {getAllEvents} from '../src/utils/events'
import {Footer} from '../src/Footer'
import {Hero} from '../src/Hero'
import type {Metadata} from 'next'

export const metadata: Metadata = {
  title: 'Miami Gooners - Official Arsenal FC Supporters Club in Miami, FL',
  description:
    'Miami Gooners: Official Arsenal FC Supporters Club. We watch all matches @thebargables. Join us for match days, events, and official merchandise.',
  alternates: {
    canonical: 'https://miamigooners.com/',
  },
}

export default async function Home() {
  const events = await getAllEvents().catch(() => [])

  return (
    <>
      <Hero />
      <div>
        <AllEvents events={events} />
        <Footer />
      </div>
    </>
  )
}
