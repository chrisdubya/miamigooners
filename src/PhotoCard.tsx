'use client'
import {useState} from 'react'
import {Box, Typography} from '@mui/material'
import {jetbrainsMono, inter} from './font'
import type {PhotoItem} from './types/photos'

function relTime(iso: string): string {
  const then = new Date(iso).getTime()
  const now = Date.now()
  const diff = Math.max(0, now - then)
  const days = diff / (1000 * 60 * 60 * 24)
  if (days < 1) return 'today'
  if (days < 2) return 'yesterday'
  if (days < 7) return `${Math.floor(days)}d ago`
  if (days < 30) return `${Math.floor(days / 7)}w ago`
  return new Date(iso).toLocaleDateString('en-US', {month: 'short', day: 'numeric'})
}

function fmtDuration(seconds: number): string {
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`
}

interface PhotoCardProps {
  photo: PhotoItem
  onOpen: () => void
}

export const PhotoCard = ({photo, onOpen}: PhotoCardProps) => {
  const [hover, setHover] = useState(false)

  const rowSpan = photo.aspect < 1 ? 40 : photo.aspect > 1.7 ? 18 : 28
  const isVideo = photo.mimeType?.startsWith('video/')
  const durationSec =
    isVideo && photo.videoMediaMetadata
      ? Math.round(parseInt(photo.videoMediaMetadata.durationMillis, 10) / 1000)
      : 0
  const shortOwner = photo.owners?.[0]?.displayName?.split(' ')[0] || ''

  return (
    <Box
      component="figure"
      onClick={onOpen}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      sx={{
        m: 0,
        position: 'relative',
        gridRow: `span ${rowSpan}`,
        background: '#111113',
        border: '1px solid',
        borderColor: hover ? '#3A3A46' : '#2E2E38',
        borderRadius: '12px',
        overflow: 'hidden',
        cursor: 'pointer',
        transition: 'transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease',
        transform: hover ? 'translateY(-4px)' : 'translateY(0)',
        boxShadow: hover
          ? '0 8px 25px rgba(0,0,0,0.4), 0 4px 10px rgba(0,0,0,0.3)'
          : 'none',
      }}
    >
      {/* Team color band */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 3,
          background: photo.teamColor,
          zIndex: 3,
        }}
      />

      {/* Image */}
      <Box
        component="img"
        src={photo.thumbnailLink || ''}
        alt={photo.description || photo.name}
        loading="lazy"
        decoding="async"
        sx={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          display: 'block',
          transform: hover ? 'scale(1.04)' : 'scale(1)',
          transition: 'transform 0.4s ease',
        }}
      />

      {/* Video badge */}
      {isVideo && (
        <Box
          sx={{
            position: 'absolute',
            top: 12,
            left: 12,
            zIndex: 4,
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '4px 8px',
            borderRadius: '4px',
            background: 'rgba(10,10,11,0.8)',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(255,255,255,0.1)',
            fontFamily: jetbrainsMono.style.fontFamily,
            fontSize: 10,
            fontWeight: 600,
            letterSpacing: '0.08em',
            color: '#F5F5F7',
          }}
        >
          <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
            <polygon points="5 3 19 12 5 21 5 3" />
          </svg>
          {fmtDuration(durationSec)}
        </Box>
      )}

      {/* Bottom gradient + meta */}
      <Box
        sx={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          padding: '48px 16px 14px',
          background:
            'linear-gradient(180deg, transparent 0%, rgba(10,10,11,0.85) 70%, rgba(10,10,11,0.95) 100%)',
          color: '#F5F5F7',
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          gap: '12px',
          opacity: hover ? 1 : 0.92,
          transition: 'opacity 0.2s',
        }}
      >
        <Box sx={{minWidth: 0, flex: 1}}>
          <Box
            sx={{
              fontFamily: jetbrainsMono.style.fontFamily,
              fontSize: 11,
              fontWeight: 500,
              letterSpacing: '0.08em',
              color: '#F5F5F7',
              textTransform: 'uppercase',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              mb: '2px',
            }}
          >
            <Box component="span" sx={{color: '#DB0007'}}>
              ●
            </Box>
            {photo.matchLabel}
          </Box>
          <Box
            sx={{
              fontFamily: inter.style.fontFamily,
              fontSize: 11,
              color: '#A1A1AA',
              fontWeight: 400,
              display: 'flex',
              gap: 1,
              alignItems: 'center',
            }}
          >
            <span>{relTime(photo.createdTime)}</span>
            {shortOwner && (
              <>
                <Box component="span" sx={{color: '#3A3A46'}}>
                  ·
                </Box>
                <span>{shortOwner}</span>
              </>
            )}
          </Box>
        </Box>
      </Box>

      {/* Hover expand icon */}
      <Box
        sx={{
          position: 'absolute',
          top: 12,
          right: 12,
          width: 32,
          height: 32,
          borderRadius: '8px',
          background: 'rgba(10,10,11,0.7)',
          backdropFilter: 'blur(8px)',
          border: '1px solid rgba(255,255,255,0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          opacity: hover ? 1 : 0,
          transition: 'opacity 0.2s',
        }}
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#F5F5F7"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="15 3 21 3 21 9" />
          <polyline points="9 21 3 21 3 15" />
          <line x1="21" y1="3" x2="14" y2="10" />
          <line x1="3" y1="21" x2="10" y2="14" />
        </svg>
      </Box>
    </Box>
  )
}
