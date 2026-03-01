'use client'
import Image from 'next/image'
import {Box, Button, Typography, Container} from '@mui/material'
import {Scene} from './Scene'
import {KeyboardArrowDown} from '@mui/icons-material'
import Link from 'next/link'
import {doppler} from './font'

export const Hero = () => {
  const scrollToMatches = () => {
    const el = document.getElementById('matches')
    if (el) {
      el.scrollIntoView({behavior: 'smooth'})
    }
  }

  return (
    <Box
      component="section"
      sx={{
        position: 'relative',
        width: '100%',
        height: {xs: '80vh', md: '100vh'},
        overflow: 'hidden',
      }}
    >
      <Image
        src="/background-2.jpeg"
        fill
        className="object-cover"
        alt="Miami Gooners supporters gathered at The Bar for a match day"
        priority
      />

      <Scene height={100} />

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

      {/* Hero content */}
      <Container
        maxWidth="lg"
        sx={{
          position: 'relative',
          zIndex: 20,
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          pb: 8,
        }}
      >
        <Box sx={{maxWidth: 600}}>
          <Typography
            component="h1"
            sx={{
              fontFamily: doppler.style.fontFamily,
              fontWeight: 700,
              fontSize: {xs: '2.5rem', md: '4rem'},
              lineHeight: 1.05,
              letterSpacing: '0.02em',
              textTransform: 'lowercase',
            }}
          >
            <Box component="span" sx={{display: 'block', color: 'rgba(255,255,255,0.85)', fontWeight: 400}}>
              MIAMI
            </Box>
            <Box component="span" sx={{display: 'block', color: '#DB0007'}}>
              GOONERS
            </Box>
          </Typography>

          <Typography
            sx={{
              fontSize: {xs: '1.25rem', md: '1.5rem'},
              fontWeight: 700,
              lineHeight: 1.4,
              color: 'rgba(255,255,255,0.85)',
              mt: 2,
            }}
          >
            Arsenal&apos;s Official Supporters Club in Miami
          </Typography>

          <Box sx={{display: 'flex', gap: 2, mt: 4}}>
            <Button
              variant="contained"
              color="primary"
              size="large"
              onClick={scrollToMatches}
              sx={{px: 3, py: 1.5}}
            >
              Next Match
            </Button>
            <Link href="/shop" style={{textDecoration: 'none'}}>
              <Button
                variant="outlined"
                size="large"
                sx={{
                  px: 3,
                  py: 1.5,
                  borderColor: '#F5F5F7',
                  color: '#F5F5F7',
                  '&:hover': {
                    backgroundColor: '#F5F5F7',
                    color: '#0A0A0B',
                    borderColor: '#F5F5F7',
                  },
                }}
              >
                Visit Shop
              </Button>
            </Link>
          </Box>
        </Box>
      </Container>

      {/* Scroll indicator */}
      <Box
        sx={{
          position: 'absolute',
          bottom: 24,
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 20,
          cursor: 'pointer',
        }}
        onClick={scrollToMatches}
      >
        <Box sx={{animation: 'heroChevronBounce 2s ease infinite', display: 'flex'}}>
          <KeyboardArrowDown sx={{fontSize: 32, color: 'rgba(255,255,255,0.6)'}} />
        </Box>
      </Box>
    </Box>
  )
}
