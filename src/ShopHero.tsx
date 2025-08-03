import Image from 'next/image'
import {X, Instagram, WhatsApp, Mail, Store, Home} from '@mui/icons-material'
import {Tooltip} from '@mui/material'
import {Scene} from './Scene'
import Link from 'next/link'

export const ShopHero = () => {
  return (
    <div className="h-[40vh] relative w-full overflow-hidden">
      <Image
        src="/background-2.jpeg"
        fill
        className="object-cover"
        alt={'group photo'}
        priority
      />

      <Scene height={40} />

      <div className="z-20 flex flex-col gap-4 absolute top-4 right-4 md:top-8 md:right-8 bg-black/75 p-4 rounded-lg border border-gooner-red">
        <Tooltip title="Home" placement="left" componentsProps={{tooltip: {sx: {fontSize: '14px'}}}}>
          <Link href="/" aria-label="go to home page">
            <Home 
              color="primary" 
              fontSize="large" 
              sx={{
                '&:hover': {
                  color: 'white',
                },
              }}
            />
          </Link>
        </Tooltip>
        <Tooltip title="Follow us on Instagram" placement="left" componentsProps={{tooltip: {sx: {fontSize: '14px'}}}}>
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
        </Tooltip>
        <Tooltip title="Follow us on X/Twitter" placement="left" componentsProps={{tooltip: {sx: {fontSize: '14px'}}}}>
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
        </Tooltip>
        <Tooltip title="Email us" placement="left" componentsProps={{tooltip: {sx: {fontSize: '14px'}}}}>
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
        </Tooltip>
        <Tooltip title="Online Shop" placement="left" componentsProps={{tooltip: {sx: {fontSize: '14px'}}}}>
          <Link href="/shop" aria-label="visit our shop">
            <Store 
              color="primary" 
              fontSize="large" 
              sx={{
                '&:hover': {
                  color: 'white',
                },
              }}
            />
          </Link>
        </Tooltip>
      </div>
    </div>
  )
}