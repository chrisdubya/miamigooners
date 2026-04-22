'use client'
import {Box, Typography} from '@mui/material'
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
  const totalAll = Object.values(totals).reduce((s, n) => s + n, 0)

  const allChips: Array<{id: string; label: string; teamColor: string | null}> = [
    {id: 'all', label: 'ALL MATCHES', teamColor: null},
    ...matches.map((m) => ({id: m.id, label: m.label, teamColor: m.teamColor})),
  ]

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
          scrollbarWidth: 'thin',
          '&::-webkit-scrollbar': {height: 4},
          '&::-webkit-scrollbar-thumb': {
            background: '#2E2E38',
            borderRadius: 2,
          },
        }}
      >
        {allChips.map((chip) => {
          const isActive = activeFilter === chip.id
          const count = chip.id === 'all' ? totalAll : totals[chip.id] || 0
          return (
            <Box
              key={chip.id}
              component="button"
              onClick={() => onFilterChange(chip.id)}
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
              {chip.teamColor && (
                <Box
                  component="span"
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: '2px',
                    background: chip.teamColor,
                    flex: '0 0 auto',
                  }}
                />
              )}
              <Box component="span">{chip.label}</Box>
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
