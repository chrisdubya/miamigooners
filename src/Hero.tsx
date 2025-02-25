import Image from 'next/image'
import {X, Instagram, WhatsApp, Mail} from '@mui/icons-material'
import {Scene} from './Scene'
import Link from 'next/link'

export const Hero = () => {
  return (
    <div className="h-[70vh] relative w-full overflow-hidden">
      <Image
        src="/background-2.jpeg"
        fill
        className="object-cover"
        alt={'group photo'}
        priority
      />

      <Scene />

      <div className="z-20 flex flex-col gap-4 absolute top-4 right-4 md:top-8 md:right-8 bg-black/75 p-4 rounded-lg border border-gooner-red">
        <Link
          href="https://www.instagram.com/miamigooners"
          aria-label="follow us on instagram"
        >
          <Instagram
            color="primary"
            fontSize="large"
            sx={{
              '&:hover': {
                color: 'white',
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
                color: 'white',
              },
            }}
          />
        </Link>
        <Link href="mailto:info@miamigooners.com" aria-label="email us">
          <Mail 
            color="primary" 
            fontSize="large" 
            sx={{
              '&:hover': {
                color: 'white',
              },
            }}
          />
        </Link>
      </div>
    </div>
  )
}
