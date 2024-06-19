import {Scene} from '../src/Scene'
import {Box, Link} from '@mui/material'
import {X, Instagram, WhatsApp} from '@mui/icons-material'
import {AllEvents} from '../src/AllEvents'
import {GetServerSideProps} from 'next'
import {EventType} from '../types'
import {getBaseUrl} from '../src/utils/env'
import Image from 'next/image'

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
      <div className="h-[70vh] relative w-full">
        <Image
          src="/background-2.jpeg"
          fill
          className="object-cover"
          alt={'group photo'}
          priority
        />

        <div className="glitch__layers">
          <div className="glitch__layer"></div>
          <div className="glitch__layer"></div>
          <div className="glitch__layer"></div>
        </div>

        <Scene />

        <div className="flex flex-col gap-4 absolute top-4 right-4 md:top-8 md:right-8 bg-black/75 p-4 rounded-lg border border-gooner-red">
          <Link
            href="https://www.instagram.com/miamigooners"
            aria-label="follow us on instagram"
          >
            <Instagram
              color="primary"
              fontSize="large"
              sx={{
                '&:hover': {
                  color: 'primary.dark',
                },
              }}
            />
          </Link>
          <Link
            href="https://twitter.com/miamigooners"
            aria-label="follow us on twitter"
          >
            <X
              color="primary"
              fontSize="large"
              sx={{
                '&:hover': {
                  color: 'primary.dark',
                },
              }}
            />
          </Link>
          <Link
            href="https://chat.whatsapp.com/L0k0g8cgYgQHegpTA8Pe7L"
            aria-label="chat with us on whatsapp"
          >
            <WhatsApp
              color="primary"
              fontSize="large"
              sx={{
                '&:hover': {
                  color: 'primary.dark',
                },
              }}
            />
          </Link>
        </div>
      </div>

      <Box component="div">
        <AllEvents events={events} />
      </Box>
    </>
  )
}
