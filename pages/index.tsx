import {Box} from '@mui/material'

import {AllEvents} from '../src/AllEvents'
import {GetServerSideProps} from 'next'
import {EventType} from '../types'
import {getBaseUrl} from '../src/utils/env'
import {Footer} from '../src/Footer'
import {Hero} from '../src/Hero'

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
  return (
    <>
      <Hero />

      <Box component="div">
        <AllEvents events={events} />

        <Footer />
      </Box>
    </>
  )
}
