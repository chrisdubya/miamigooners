import {Suspense} from 'react'
import {EventsSection} from './EventsSection'
import {EventsSkeleton} from '../src/EventsSkeleton'
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

export default function Home() {
  return (
    <>
      <Hero />
      <div>
        <Suspense fallback={<EventsSkeleton />}>
          <EventsSection />
        </Suspense>
        <Footer />
      </div>
    </>
  )
}
