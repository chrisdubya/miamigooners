import Image from 'next/image'
import {X, Instagram, WhatsApp} from '@mui/icons-material'
import {Scene} from './Scene'
import Link from 'next/link'

export const Hero = () => {
  return (
    <div className="h-[70vh] relative w-full">
      <Image
        src="/background-2.jpeg"
        fill
        className="object-cover"
        alt={'group photo'}
        priority
      />

      <div className="absolute z-10 left-0 right-0 top-0 bottom-0">
        <div className="absolute top-0 left-0 right-0 bottom-0 bg-[url('/background-2.jpeg')] bg-no-repeat bg-center -translate-x-[5%] animate-glitch-anim-1"></div>
        <div className="absolute top-0 left-0 right-0 bottom-0 bg-[url('/background-2.jpeg')] bg-no-repeat bg-center -translate-x-[15%] translate-y-[3%] animate-glitch-anim-2"></div>
        <div className="absolute top-0 left-0 right-0 bottom-0 bg-[url('/background-2.jpeg')] bg-no-repeat bg-center translate-x-[10%] animate-glitch-anim-flash"></div>
      </div>

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
  )
}
