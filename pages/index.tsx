import {Scene} from '../src/Scene'
import {Container, Box, Link} from '@mui/material'
import {Twitter, Instagram} from '@mui/icons-material'
import {AllEvents} from '../src/AllEvents'
import {GetServerSideProps} from 'next'
import {EventType} from '../types'
import {images} from '../src/constants/images'
import {DateTime} from 'luxon'
import {getBaseUrl} from '../src/utils/env'
import {Logger} from 'next-axiom'

export const getServerSideProps = (async () => {
  try {
    const res = await fetch(`${getBaseUrl()}/api/events`)
    const events: EventType[] = await res.json()

    const updatedEvents = events.map((event: EventType) => {
      const homeTeamImage = event.HomeTeam.toLowerCase().replace(/\s/g, '-')
      const awayTeamImage = event.AwayTeam.toLowerCase().replace(/\s/g, '-')

      if (images.includes(`${awayTeamImage}-home`)) {
        event = {
          ...event,
          image: `${process.env.NEXT_PUBLIC_CDN_URL}/images/matchday-photos/${awayTeamImage}-home.jpg`,
        }
      }

      if (images.includes(`${homeTeamImage}-away`)) {
        event = {
          ...event,
          image: `${process.env.NEXT_PUBLIC_CDN_URL}/images/matchday-photos/${homeTeamImage}-away.jpg`,
        }
      }

      // schedule updates July 8th (until API updates)
      if (
        DateTime.fromFormat(event.DateUtc, "yyyy-MM-dd HH:mm:ss'Z'", {
          zone: 'utc',
        }).year === 2023
      ) {
        if (
          event.HomeTeam === 'Crystal Palace' &&
          DateTime.fromFormat(event.DateUtc, "yyyy-MM-dd HH:mm:ss'Z'", {
            zone: 'utc',
          }).month === 8
        ) {
          event = {
            ...event,
            DateUtc: '2023-08-21 19:00:00Z',
          }
        }

        if (
          event.AwayTeam === 'Man Utd' &&
          DateTime.fromFormat(event.DateUtc, "yyyy-MM-dd HH:mm:ss'Z'", {
            zone: 'utc',
          }).month === 9
        ) {
          event = {
            ...event,
            DateUtc: '2023-09-03 15:30:00Z',
          }
        }

        if (
          event.HomeTeam === 'Everton' &&
          DateTime.fromFormat(event.DateUtc, "yyyy-MM-dd HH:mm:ss'Z'", {
            zone: 'utc',
          }).month === 9
        ) {
          event = {
            ...event,
            DateUtc: '2023-09-17 15:30:00Z',
          }
        }

        if (
          event.AwayTeam === 'Spurs' &&
          DateTime.fromFormat(event.DateUtc, "yyyy-MM-dd HH:mm:ss'Z'", {
            zone: 'utc',
          }).month === 9
        ) {
          event = {
            ...event,
            DateUtc: '2023-09-24 13:00:00Z',
          }
        }
      }

      return event
    })
    return {props: {events: updatedEvents}}
  } catch (error) {
    return {props: {events: []}}
  }
}) satisfies GetServerSideProps<{events: EventType[]}>

export default function Home({events}: {events: EventType[]}) {
  return (
    <Container sx={{paddingRight: 0, paddingLeft: 0}}>
      <Box component="div" sx={{height: '70vh'}}>
        <Box
          component="div"
          sx={{
            position: 'absolute',
            height: '70vh',
            zIndex: '-1',
            inset: 0,
            background: 'url(/background.jpeg) no-repeat center center fixed',
            backgroundSize: 'cover',
          }}
        />

        <Scene />

        <Box
          component="div"
          sx={{
            display: 'flex',
            gap: '0.5rem',
            position: 'absolute',
            top: '2rem',
            right: '2rem',
          }}
        >
          <Link href="https://www.instagram.com/miamigooners">
            <Instagram color="primary" fontSize="large" />
          </Link>
          <Link href="https://twitter.com/miamigooners">
            <Twitter color="primary" fontSize="large" />
          </Link>
        </Box>
      </Box>

      <Box component="div">
        <AllEvents events={events} />
      </Box>
    </Container>
  )
}
