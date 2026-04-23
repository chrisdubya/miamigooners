'use client'
import {Box} from '@mui/material'
import {jetbrainsMono} from './font'
import type {MatchFolder} from './types/photos'

interface PhotosFilterBarProps {
  matches: MatchFolder[]
  activeFilter: string
  onFilterChange: (id: string) => void
  totals: Record<string, number>
}

export const PhotosFilterBar = ({
  matches,
  activeFilter,
  onFilterChange,
  totals,
}: PhotosFilterBarProps) => {
  return (
    <Box
      sx={{
        position: 'sticky',
        top: {xs: 56, md: 64},
        zIndex: 40,
        background: 'rgba(10,10,11,0.92)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderBottom: '1px solid #2E2E38',
      }}
    >
      <Box
        sx={{
          maxWidth: 1200,
          mx: 'auto',
          px: {xs: 2, md: 4},
          py: 2,
          display: 'flex',
          gap: 1,
          overflowX: 'auto',
          flexWrap: 'nowrap',
          scrollbarWidth: 'none',
          '&::-webkit-scrollbar': {display: 'none'},
        }}
      >
        {matches.map((match) => {
          const isActive = activeFilter === match.id
          const count = totals[match.id] || 0
          return (
            <Box
              key={match.id}
              component="button"
              onClick={() => onFilterChange(match.id)}
              sx={{
                flex: '0 0 auto',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '8px 14px',
                borderRadius: 999,
                border: '1px solid',
                borderColor: isActive ? '#DB0007' : '#2E2E38',
                background: isActive ? 'rgba(219,0,7,0.1)' : '#111113',
                color: isActive ? '#F5F5F7' : '#A1A1AA',
                fontFamily: jetbrainsMono.style.fontFamily,
                fontSize: 12,
                fontWeight: 500,
                letterSpacing: '0.05em',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                whiteSpace: 'nowrap',
                '&:hover': isActive
                  ? {}
                  : {
                      borderColor: '#3A3A46',
                      color: '#F5F5F7',
                    },
              }}
            >
              <Box
                component="span"
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: '2px',
                  background: match.teamColor,
                  flex: '0 0 auto',
                }}
              />
              <Box component="span">{match.label}</Box>
              <Box
                component="span"
                sx={{
                  color: isActive ? '#DB0007' : '#71717A',
                  fontSize: 11,
                  fontWeight: 700,
                }}
              >
                {count}
              </Box>
            </Box>
          )
        })}
      </Box>
    </Box>
  )
}
