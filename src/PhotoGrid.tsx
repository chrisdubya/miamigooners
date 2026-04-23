'use client'
import {Box} from '@mui/material'
import {PhotoCard} from './PhotoCard'
import {doppler, jetbrainsMono, inter} from './font'
import type {PhotoItem, MatchFolder} from './types/photos'

function formatMatchDate(iso: string): string {
  const d = new Date(iso)
  return d.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

interface PhotoGridProps {
  photos: PhotoItem[]
  match?: MatchFolder
  onOpen: (photo: PhotoItem) => void
}

export const PhotoGrid = ({photos, match, onOpen}: PhotoGridProps) => {
  const resultColor =
    match?.result === 'W'
      ? '#22C55E'
      : match?.result === 'L'
        ? '#EF4444'
        : match?.result === 'D'
          ? '#EAB308'
          : undefined

  return (
    <Box sx={{px: {xs: 2, md: 4}, py: {xs: 3, md: 5}, pb: {xs: 8, md: 10}}}>
      <Box sx={{maxWidth: 1200, mx: 'auto'}}>
        {/* Match header */}
        {match && (
          <Box
            sx={{
              mb: 4,
              pb: 3,
              borderBottom: '1px solid #2E2E38',
            }}
          >
            {/* Top row: competition + result badge */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                mb: '12px',
              }}
            >
              <Box
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '4px 8px',
                  borderRadius: '4px',
                  background: 'rgba(212, 168, 67, 0.1)',
                  fontFamily: inter.style.fontFamily,
                  fontSize: 10,
                  fontWeight: 600,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  color: '#D4A843',
                }}
              >
                {match.competition}
              </Box>

              {match.result && (
                <Box
                  sx={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: resultColor,
                    color: '#fff',
                    fontFamily: jetbrainsMono.style.fontFamily,
                    fontWeight: 700,
                    fontSize: 14,
                    letterSpacing: '0.05em',
                    borderRadius: '4px',
                    px: 1,
                    py: 0.5,
                    minWidth: 28,
                  }}
                >
                  {match.result}
                </Box>
              )}
            </Box>

            {/* Middle row: team color bar + opponent + home/away */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                mb: '8px',
              }}
            >
              <Box
                sx={{
                  width: 4,
                  height: 36,
                  borderRadius: 1,
                  background: match.teamColor,
                  flex: '0 0 auto',
                }}
              />
              <Box
                sx={{
                  fontFamily: doppler.style.fontFamily,
                  textTransform: 'lowercase',
                  fontSize: {xs: 24, md: 32},
                  fontWeight: 700,
                  color: '#F5F5F7',
                  lineHeight: 1.1,
                }}
              >
                {match.label}
              </Box>
              {match.isHome !== null && (
                <Box
                  sx={{
                    fontFamily: inter.style.fontFamily,
                    fontSize: 12,
                    fontWeight: 500,
                    letterSpacing: '0.02em',
                    textTransform: 'uppercase',
                    color: '#71717A',
                  }}
                >
                  ({match.isHome ? 'H' : 'A'})
                </Box>
              )}
            </Box>

            {/* Score */}
            {match.score && (
              <Box
                sx={{
                  fontFamily: jetbrainsMono.style.fontFamily,
                  fontWeight: 700,
                  fontSize: {xs: 18, md: 22},
                  letterSpacing: '0.05em',
                  color: '#F5F5F7',
                  mb: '10px',
                  ml: '20px',
                }}
              >
                {match.score}
              </Box>
            )}

            {/* Bottom row: date + photo count */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                fontFamily: jetbrainsMono.style.fontFamily,
                fontSize: 12,
                color: '#71717A',
                letterSpacing: '0.05em',
              }}
            >
              <span>{formatMatchDate(match.date)}</span>
              <Box component="span" sx={{color: '#2E2E38'}}>
                |
              </Box>
              <span>
                {match.files.length}{' '}
                {match.files.length === 1 ? 'photo' : 'photos'}
              </span>
            </Box>
          </Box>
        )}

        {/* Photo grid — columns, natural height */}
        <Box
          sx={{
            columns: {xs: 1, sm: 2, md: 3},
            columnGap: '16px',
          }}
        >
          {photos.map((p) => (
            <PhotoCard key={p.id} photo={p} onOpen={() => onOpen(p)} />
          ))}
        </Box>
      </Box>
    </Box>
  )
}
