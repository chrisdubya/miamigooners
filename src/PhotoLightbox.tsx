'use client'
import {useState, useEffect, useCallback} from 'react'
import Image from 'next/image'
import {Box, Typography} from '@mui/material'
import {jetbrainsMono, inter} from './font'
import type {PhotoItem, MatchFolder} from './types/photos'

function MetaRow({label, value}: {label: string; value: string}) {
  return (
    <Box>
      <Typography
        sx={{
          color: '#71717A',
          fontSize: 9,
          letterSpacing: '0.15em',
          textTransform: 'uppercase',
          mb: '3px',
          fontFamily: jetbrainsMono.style.fontFamily,
        }}
      >
        {label}
      </Typography>
      <Typography
        sx={{
          color: '#F5F5F7',
          fontSize: 12,
          letterSpacing: '0.03em',
          fontFamily: jetbrainsMono.style.fontFamily,
        }}
      >
        {value}
      </Typography>
    </Box>
  )
}

interface PhotoLightboxProps {
  photo: PhotoItem | null
  photos: PhotoItem[]
  matches: MatchFolder[]
  onClose: () => void
  onNavigate: (photo: PhotoItem) => void
}

export const PhotoLightbox = ({
  photo,
  photos,
  matches,
  onClose,
  onNavigate,
}: PhotoLightboxProps) => {
  const [videoPlaying, setVideoPlaying] = useState(false)
  const idx = photo ? photos.findIndex((p) => p.id === photo.id) : -1
  const match = photo ? matches.find((m) => m.id === photo.matchId) : null

  const prev = useCallback(() => {
    if (!photo || photos.length === 0) return
    setVideoPlaying(false)
    onNavigate(photos[(idx - 1 + photos.length) % photos.length])
  }, [photo, photos, idx, onNavigate])

  const next = useCallback(() => {
    if (!photo || photos.length === 0) return
    setVideoPlaying(false)
    onNavigate(photos[(idx + 1) % photos.length])
  }, [photo, photos, idx, onNavigate])

  useEffect(() => {
    if (!photo) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft') prev()
      if (e.key === 'ArrowRight') next()
    }
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [photo, prev, next, onClose])

  if (!photo || !match) return null

  const isVideo = photo.mimeType?.startsWith('video/')
  const ownerName = photo.owners?.[0]?.displayName || 'Unknown'
  const initials = ownerName
    .split(' ')
    .map((s) => s[0])
    .join('')
    .slice(0, 2)

  const durationSec =
    isVideo && photo.videoMediaMetadata
      ? Math.round(parseInt(photo.videoMediaMetadata.durationMillis, 10) / 1000)
      : 0
  const fmtDur = `${Math.floor(durationSec / 60)}:${String(durationSec % 60).padStart(2, '0')}`

  const downloadUrl =
    photo.originalUrl ??
    (isVideo
      ? `https://drive.google.com/uc?export=download&id=${photo.id}`
      : `https://storage.googleapis.com/miami-gooners-photos/thumbnails/${photo.id}_w1600.jpg`)

  return (
    <Box
      onClick={onClose}
      sx={{
        position: 'fixed',
        inset: 0,
        zIndex: 1300,
        background: 'rgba(10,10,11,0.94)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 3,
        animation: 'fadeIn 0.2s ease',
      }}
    >
      {/* Close button */}
      <Box
        component="button"
        onClick={(e: React.MouseEvent) => {
          e.stopPropagation()
          onClose()
        }}
        aria-label="Close"
        sx={{
          position: 'fixed',
          top: 20,
          right: 20,
          zIndex: 1302,
          width: 44,
          height: 44,
          borderRadius: '8px',
          background: '#111113',
          border: '1px solid #2E2E38',
          color: '#F5F5F7',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          '&:hover': {background: '#1A1A1E', borderColor: '#3A3A46'},
        }}
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </Box>

      {/* Counter */}
      <Box
        sx={{
          position: 'fixed',
          top: 28,
          left: 32,
          zIndex: 1302,
          fontFamily: jetbrainsMono.style.fontFamily,
          fontSize: 12,
          color: '#A1A1AA',
          letterSpacing: '0.1em',
        }}
      >
        {String(idx + 1).padStart(2, '0')}{' '}
        <Box component="span" sx={{color: '#71717A'}}>
          /
        </Box>{' '}
        {String(photos.length).padStart(2, '0')}
      </Box>

      {/* Prev arrow */}
      <NavArrow
        dir="left"
        onClick={(e) => {
          e.stopPropagation()
          prev()
        }}
      />
      {/* Next arrow */}
      <NavArrow
        dir="right"
        onClick={(e) => {
          e.stopPropagation()
          next()
        }}
      />

      {/* Content card */}
      <Box
        onClick={(e: React.MouseEvent) => e.stopPropagation()}
        sx={{
          display: 'grid',
          gridTemplateColumns: {xs: '1fr', md: 'minmax(0, 1fr) 320px'},
          gap: 0,
          maxWidth: 1200,
          width: '100%',
          maxHeight: '90vh',
          background: '#111113',
          border: '1px solid #2E2E38',
          borderRadius: '12px',
          overflow: 'hidden',
          boxShadow: '0 8px 40px rgba(0,0,0,0.6)',
        }}
      >
        {/* Image side */}
        <Box
          sx={{
            position: 'relative',
            background: '#0A0A0B',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: {xs: 250, md: 400},
            maxHeight: '90vh',
            overflow: 'hidden',
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
              background: match.teamColor,
              zIndex: 2,
            }}
          />

          {isVideo ? (
            <Box
              sx={{
                width: '100%',
                aspectRatio: photo.aspect || 1.5,
                background: '#0A0A0B',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                maxHeight: '90vh',
                minHeight: 300,
              }}
            >
              {videoPlaying ? (
                <Box
                  component="iframe"
                  src={`https://drive.google.com/file/d/${photo.id}/preview`}
                  allow="autoplay"
                  allowFullScreen
                  sx={{
                    width: '100%',
                    height: '100%',
                    position: 'absolute',
                    inset: 0,
                    border: 'none',
                  }}
                />
              ) : (
                <>
                  <Box
                    sx={{
                      position: 'absolute',
                      inset: 0,
                      backgroundImage: `url(${photo.thumbnailLink})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                    }}
                  />
                  <Box
                    sx={{
                      position: 'absolute',
                      inset: 0,
                      background:
                        'linear-gradient(180deg, rgba(10,10,11,0.2), rgba(10,10,11,0.6))',
                    }}
                  />
                  <Box
                    component="button"
                    onClick={() => setVideoPlaying(true)}
                    sx={{
                      position: 'relative',
                      zIndex: 2,
                      width: 72,
                      height: 72,
                      borderRadius: '50%',
                      border: '1px solid rgba(255,255,255,0.2)',
                      background: 'rgba(219,0,7,0.9)',
                      color: '#fff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      boxShadow: '0 0 32px rgba(219,0,7,0.5)',
                    }}
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                      <polygon points="6 4 20 12 6 20 6 4" />
                    </svg>
                  </Box>
                </>
              )}
            </Box>
          ) : (
            <Box
              sx={{
                position: 'relative',
                width: '100%',
                height: '100%',
                minHeight: {xs: 250, md: 400},
                maxHeight: '90vh',
              }}
            >
              <Image
                src={`https://storage.googleapis.com/miami-gooners-photos/thumbnails/${photo.id}_w1600.jpg`}
                alt={photo.description || `Miami Gooners watch party photo – ${match.label}`}
                fill
                sizes="(max-width: 900px) 100vw, 60vw"
                priority
                style={{
                  objectFit: 'contain',
                }}
              />
            </Box>
          )}
        </Box>

        {/* Meta sidebar */}
        <Box
          component="aside"
          sx={{
            display: 'flex',
            flexDirection: 'column',
            borderLeft: {xs: 'none', md: '1px solid #2E2E38'},
            borderTop: {xs: '1px solid #2E2E38', md: 'none'},
            background: '#111113',
            minHeight: {xs: 'auto', md: 400},
            maxHeight: {xs: '50vh', md: '90vh'},
          }}
        >
          {/* Header */}
          <Box sx={{padding: '20px 24px 16px', borderBottom: '1px solid #2E2E38'}}>
            <Box sx={{display: 'flex', alignItems: 'center', gap: '10px', mb: '12px'}}>
              {/* Avatar */}
              <Box
                sx={{
                  width: 36,
                  height: 36,
                  borderRadius: '50%',
                  background: '#1A1A1E',
                  border: '1px solid #2E2E38',
                  color: '#F5F5F7',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontFamily: inter.style.fontFamily,
                  fontSize: 13,
                  fontWeight: 600,
                  flex: '0 0 auto',
                }}
              >
                {initials}
              </Box>
              <Box sx={{minWidth: 0, flex: 1}}>
                <Typography
                  sx={{
                    fontFamily: inter.style.fontFamily,
                    fontSize: 13,
                    fontWeight: 600,
                    color: '#F5F5F7',
                  }}
                >
                  {ownerName}
                </Typography>
              </Box>
            </Box>

            <Box sx={{display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap'}}>
              {match.competition && (
                <Box
                  component="span"
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
              )}
              <Box
                component="span"
                sx={{
                  fontFamily: jetbrainsMono.style.fontFamily,
                  fontSize: 12,
                  fontWeight: 500,
                  color: '#DB0007',
                  letterSpacing: '0.05em',
                  textShadow: '0 0 8px rgba(219,0,7,0.3)',
                }}
              >
                {match.label}
              </Box>
              {isVideo && (
                <Box
                  component="span"
                  sx={{
                    fontFamily: jetbrainsMono.style.fontFamily,
                    fontSize: 10,
                    fontWeight: 600,
                    padding: '3px 6px',
                    borderRadius: '4px',
                    background: '#1A1A1E',
                    border: '1px solid #2E2E38',
                    color: '#A1A1AA',
                    letterSpacing: '0.08em',
                  }}
                >
                  VIDEO
                </Box>
              )}
            </Box>
          </Box>

          {/* File metadata */}
          <Box sx={{padding: '20px 24px', flex: 1, overflow: 'auto'}}>
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '10px 16px',
              }}
            >
              <MetaRow
                label="CREATED"
                value={new Date(photo.createdTime)
                  .toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })
                  .toUpperCase()}
              />
              <MetaRow
                label="TIME"
                value={new Date(photo.createdTime)
                  .toLocaleTimeString('en-US', {hour: 'numeric', minute: '2-digit'})
                  .toUpperCase()}
              />
              {photo.imageMediaMetadata && (
                <MetaRow
                  label="DIMENSIONS"
                  value={`${photo.imageMediaMetadata.width}\u00D7${photo.imageMediaMetadata.height}`}
                />
              )}
              {photo.videoMediaMetadata && <MetaRow label="DURATION" value={fmtDur} />}
              <MetaRow
                label="SIZE"
                value={`${(parseInt(photo.size, 10) / (1024 * 1024)).toFixed(1)} MB`}
              />
              <MetaRow
                label="TYPE"
                value={photo.mimeType.split('/')[1]?.toUpperCase() || 'UNKNOWN'}
              />
            </Box>
          </Box>

          {/* Actions */}
          <Box
            sx={{
              padding: '16px 24px',
              borderTop: '1px solid #2E2E38',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
            }}
          >
            <Box sx={{flex: 1}} />
            <Box
              component="a"
              href={downloadUrl}
              download={photo.name}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 14px',
                borderRadius: '8px',
                background: '#DB0007',
                color: '#fff',
                fontFamily: inter.style.fontFamily,
                fontSize: 11,
                fontWeight: 600,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                textDecoration: 'none',
                transition: 'background 0.2s',
                '&:hover': {
                  background: '#FF1A22',
                },
              }}
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              Download
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

function NavArrow({
  dir,
  onClick,
}: {
  dir: 'left' | 'right'
  onClick: (e: React.MouseEvent) => void
}) {
  const isLeft = dir === 'left'
  return (
    <Box
      component="button"
      onClick={onClick}
      aria-label={isLeft ? 'Previous' : 'Next'}
      sx={{
        position: 'fixed',
        top: '50%',
        transform: 'translateY(-50%)',
        ...(isLeft ? {left: 20} : {right: 20}),
        zIndex: 1302,
        width: 48,
        height: 48,
        borderRadius: '50%',
        background: '#111113',
        border: '1px solid #2E2E38',
        color: '#F5F5F7',
        cursor: 'pointer',
        display: {xs: 'none', md: 'flex'},
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'background 0.2s, border-color 0.2s',
        '&:hover': {
          background: '#1A1A1E',
          borderColor: '#3A3A46',
        },
      }}
    >
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {isLeft ? (
          <polyline points="15 18 9 12 15 6" />
        ) : (
          <polyline points="9 18 15 12 9 6" />
        )}
      </svg>
    </Box>
  )
}
