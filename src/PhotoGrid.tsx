'use client'
import {useMemo} from 'react'
import {Box, Typography} from '@mui/material'
import {PhotoCard} from './PhotoCard'
import {doppler, jetbrainsMono, inter} from './font'
import type {PhotoItem, MatchFolder} from './types/photos'

interface MatchDividerProps {
  match: MatchFolder
  count: number
}

function MatchDivider({match, count}: MatchDividerProps) {
  return (
    <Box
      sx={{
        gridColumn: '1 / -1',
        padding: '8px 0 4px',
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        borderBottom: '1px solid #2E2E38',
        mb: '4px',
        flexWrap: 'wrap',
      }}
    >
      <Box
        sx={{
          width: 10,
          height: 10,
          borderRadius: '2px',
          background: match.teamColor,
        }}
      />
      <Typography
        component="h2"
        sx={{
          fontFamily: doppler.style.fontFamily,
          fontWeight: 700,
          fontSize: {xs: 22, md: 28},
          letterSpacing: '-0.01em',
          textTransform: 'lowercase',
          color: '#F5F5F7',
          m: 0,
        }}
      >
        vs {match.opponent}
      </Typography>
      <Box
        component="span"
        sx={{
          fontFamily: jetbrainsMono.style.fontFamily,
          fontSize: 13,
          fontWeight: 500,
          color: '#DB0007',
          textShadow: '0 0 8px rgba(219,0,7,0.3)',
          letterSpacing: '0.05em',
        }}
      >
        {match.label}
      </Box>
      <Box
        component="span"
        sx={{
          fontFamily: inter.style.fontFamily,
          fontSize: 12,
          color: '#71717A',
          letterSpacing: '0.05em',
          textTransform: 'uppercase',
        }}
      >
        · {match.competition}
      </Box>
      <Box sx={{flex: 1}} />
      <Box
        component="span"
        sx={{
          fontFamily: jetbrainsMono.style.fontFamily,
          fontSize: 12,
          color: '#71717A',
          letterSpacing: '0.05em',
        }}
      >
        {count} {count === 1 ? 'FILE' : 'FILES'}
      </Box>
    </Box>
  )
}

interface PhotoGridProps {
  photos: PhotoItem[]
  matches: MatchFolder[]
  filter: string
  onOpen: (photo: PhotoItem) => void
}

export const PhotoGrid = ({photos, matches, filter, onOpen}: PhotoGridProps) => {
  const matchById = useMemo(
    () => Object.fromEntries(matches.map((m) => [m.id, m])),
    [matches]
  )

  const grouped = useMemo(() => {
    const byMatch: Record<string, PhotoItem[]> = {}
    for (const p of photos) {
      if (!byMatch[p.matchId]) byMatch[p.matchId] = []
      byMatch[p.matchId].push(p)
    }
    return matches
      .map((m) => ({match: m, photos: byMatch[m.id] || []}))
      .filter((g) => g.photos.length > 0)
  }, [photos, matches])

  const gridSx = {
    display: 'grid',
    gridTemplateColumns: {xs: 'repeat(2, 1fr)', sm: 'repeat(3, 1fr)'},
    gridAutoRows: '8px',
    gap: 2,
  }

  // "by-match" mode: grouped with dividers (when filter is 'all')
  if (filter === 'all') {
    return (
      <Box sx={{px: {xs: 2, md: 4}, py: {xs: 3, md: 5}, pb: {xs: 8, md: 10}}}>
        <Box
          sx={{
            maxWidth: 1200,
            mx: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: 7,
          }}
        >
          {grouped.map(({match, photos: ps}) => (
            <Box component="section" key={match.id}>
              <MatchDivider match={match} count={ps.length} />
              <Box sx={{mt: '20px', ...gridSx}}>
                {ps.map((p) => (
                  <PhotoCard key={p.id} photo={p} onOpen={() => onOpen(p)} />
                ))}
              </Box>
            </Box>
          ))}
        </Box>
      </Box>
    )
  }

  // "chrono" mode: flat grid sorted by createdTime desc (when a specific match is filtered)
  const sorted = [...photos].sort(
    (a, b) => new Date(b.createdTime).getTime() - new Date(a.createdTime).getTime()
  )

  return (
    <Box sx={{px: {xs: 2, md: 4}, py: {xs: 3, md: 5}, pb: {xs: 8, md: 10}}}>
      <Box sx={{maxWidth: 1200, mx: 'auto', ...gridSx}}>
        {sorted.map((p) => (
          <PhotoCard key={p.id} photo={p} onOpen={() => onOpen(p)} />
        ))}
      </Box>
    </Box>
  )
}
