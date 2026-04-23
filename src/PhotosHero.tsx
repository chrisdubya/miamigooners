'use client'
import {Box, Typography} from '@mui/material'
import {doppler, inter, jetbrainsMono} from './font'
import type {PhotosData} from './types/photos'

interface PhotosHeroProps {
  stats: PhotosData['stats']
}

function Stat({label, value, accent}: {label: string; value: string; accent?: boolean}) {
  return (
    <Box>
      <Typography
        sx={{
          fontFamily: inter.style.fontFamily,
          fontSize: 11,
          fontWeight: 500,
          color: '#71717A',
          letterSpacing: '0.15em',
          textTransform: 'uppercase',
          mb: '6px',
        }}
      >
        {label}
      </Typography>
      <Typography
        sx={{
          fontFamily: jetbrainsMono.style.fontFamily,
          fontSize: 22,
          fontWeight: 700,
          color: accent ? '#DB0007' : '#F5F5F7',
          letterSpacing: '0.05em',
          textShadow: accent ? '0 0 12px rgba(219,0,7,0.4)' : 'none',
        }}
      >
        {value}
      </Typography>
    </Box>
  )
}

export const PhotosHero = ({stats}: PhotosHeroProps) => {
  return (
    <Box
      component="section"
      sx={{
        position: 'relative',
        width: '100%',
        overflow: 'hidden',
        borderBottom: '1px solid #2E2E38',
        background: 'linear-gradient(180deg, #0A0A0B 0%, #0A0A0B 60%, #111113 100%)',
        pt: {xs: '80px', md: '96px'},
        pb: {xs: 6, md: '48px'},
        px: {xs: 2, md: 4},
      }}
    >
      {/* Ember dots */}
      <Box
        aria-hidden="true"
        sx={{position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0.5}}
      >
        {Array.from({length: 18}).map((_, i) => {
          const left = (i * 73) % 100
          const top = (i * 127) % 100
          const size = 2 + (i % 3)
          return (
            <Box
              key={i}
              sx={{
                position: 'absolute',
                left: `${left}%`,
                top: `${top}%`,
                width: size,
                height: size,
                borderRadius: '50%',
                background: '#DB0007',
                opacity: 0.15 + (i % 4) * 0.05,
                boxShadow: '0 0 6px #DB0007',
                animation: `emberFloat 6s ${(i * 0.3) % 6}s ease-in-out infinite`,
              }}
            />
          )
        })}
      </Box>

      <Box sx={{maxWidth: 1200, mx: 'auto', position: 'relative'}}>
        {/* Eyebrow */}
        <Box
          sx={{
            fontFamily: inter.style.fontFamily,
            fontSize: 12,
            fontWeight: 500,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: '#71717A',
            mb: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
          }}
        >
          <Box component="span" sx={{width: 24, height: 2, background: '#DB0007'}} />
          <Box component="span">from the feed</Box>
        </Box>

        {/* Title */}
        <Typography
          component="h1"
          sx={{
            fontFamily: doppler.style.fontFamily,
            fontWeight: 700,
            fontSize: 'clamp(44px, 6vw, 72px)',
            lineHeight: 1.0,
            letterSpacing: '0.01em',
            textTransform: 'lowercase',
            m: 0,
            color: '#F5F5F7',
          }}
        >
          <Box component="span" sx={{color: '#A1A1AA', fontWeight: 400}}>
            matchday
          </Box>{' '}
          <Box component="span" sx={{color: '#DB0007'}}>
            photos
          </Box>
        </Typography>

        {/* Description */}
        <Box sx={{mt: 3, maxWidth: 640}}>
          <Typography
            component="p"
            sx={{
              fontFamily: inter.style.fontFamily,
              fontSize: 16,
              lineHeight: 1.6,
              color: '#A1A1AA',
              m: 0,
            }}
          >
            Photos from our Arsenal watch parties at The Bar in Coral Gables, Miami. Shot by the group.
          </Typography>
        </Box>

        {/* Stats strip */}
        <Box
          sx={{
            mt: 4,
            display: 'flex',
            gap: {xs: 3, md: 5},
            flexWrap: 'wrap',
          }}
        >
          <Stat label="PHOTOS" value={String(stats.totalFiles)} />
          <Stat label="MATCHES" value={String(stats.totalMatches)} />
        </Box>
      </Box>
    </Box>
  )
}
