'use client'
import Image from 'next/image'
import {Box, Typography, Container} from '@mui/material'
import {Scene} from './Scene'
import {doppler} from './font'

export const ShopHero = () => {
  return (
    <Box
      component="section"
      sx={{
        position: 'relative',
        width: '100%',
        height: {xs: '40vh', md: '50vh'},
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Image
        src="/background-2.jpeg"
        fill
        className="object-cover"
        alt="Miami Gooners supporters gathered at The Bar for a match day"
        priority
      />

      <Scene height={50} />

      {/* Dark gradient overlay */}
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(180deg, transparent 0%, rgba(10,10,11,0.4) 40%, rgba(10,10,11,0.95) 100%)',
          zIndex: 5,
        }}
      />

      <Container
        maxWidth="lg"
        sx={{
          position: 'relative',
          zIndex: 20,
          textAlign: 'center',
        }}
      >
        <Typography
          component="h1"
          sx={{
            fontFamily: doppler.style.fontFamily,
            fontWeight: 700,
            fontSize: {xs: '2.5rem', md: '4rem'},
            lineHeight: 1.05,
            letterSpacing: '0.02em',
            textTransform: 'lowercase',
            color: 'text.primary',
          }}
        >
          SHOP
        </Typography>
        <Typography
          sx={{
            fontSize: {xs: '1rem', md: '1.125rem'},
            lineHeight: 1.6,
            color: 'text.secondary',
            mt: 2,
          }}
        >
          Official Miami Gooners Merchandise
        </Typography>
      </Container>
    </Box>
  )
}
