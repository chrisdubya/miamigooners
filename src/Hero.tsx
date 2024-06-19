import Image from 'next/image'
import {X, Instagram, WhatsApp} from '@mui/icons-material'
import {Scene} from './Scene'
import Link from 'next/link'
import styles from './Hero.module.css'

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

      <div className={styles.glitchLayers}>
        <div className={styles.glitchLayer}></div>
        <div className={styles.glitchLayer}></div>
        <div className={styles.glitchLayer}></div>
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
  )
}
