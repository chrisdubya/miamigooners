'use client'
import {useEffect, useState} from 'react'
import {Box, Button} from '@mui/material'
import {ANNOUNCEMENT_EXPIRY, ANNOUNCEMENT_OPEN_EVENT} from './AnnouncementModal'
import {inter} from './font'

const BANNER_HEIGHT_PX = 40

export const AnnouncementBanner = () => {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const remaining = ANNOUNCEMENT_EXPIRY - Date.now()
    if (remaining <= 0) return
    setVisible(true)
    document.documentElement.style.setProperty(
      '--announcement-banner-height',
      `${BANNER_HEIGHT_PX}px`,
    )
    const timeout = window.setTimeout(() => {
      setVisible(false)
      document.documentElement.style.removeProperty('--announcement-banner-height')
    }, remaining)
    return () => {
      window.clearTimeout(timeout)
      document.documentElement.style.removeProperty('--announcement-banner-height')
    }
  }, [])

  if (!visible) return null

  const handleOpen = () => {
    window.dispatchEvent(new Event(ANNOUNCEMENT_OPEN_EVENT))
  }

  return (
    <Box
      role="region"
      aria-label="UCL Final vs PSG announcement"
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: `${BANNER_HEIGHT_PX}px`,
        backgroundColor: '#DB0007',
        color: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: {xs: 1, sm: 1.5},
        zIndex: 60,
        px: 2,
        fontFamily: inter.style.fontFamily,
        fontSize: {xs: '0.75rem', sm: '0.875rem'},
        fontWeight: 600,
        textAlign: 'center',
        letterSpacing: '0.01em',
      }}
    >
      <Box component="span" sx={{display: {xs: 'none', sm: 'inline'}}}>
        🚨 UCL Final vs PSG — must-read info for Saturday at The Bar
      </Box>
      <Box component="span" sx={{display: {xs: 'inline', sm: 'none'}}}>
        🚨 UCL Final — Saturday at The Bar
      </Box>
      <Button
        onClick={handleOpen}
        variant="text"
        disableRipple
        sx={{
          color: '#fff',
          fontFamily: inter.style.fontFamily,
          fontWeight: 700,
          fontSize: {xs: '0.75rem', sm: '0.875rem'},
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          textDecoration: 'underline',
          textUnderlineOffset: 3,
          minWidth: 0,
          px: 1,
          py: 0.25,
          '&:hover': {backgroundColor: 'rgba(255,255,255,0.12)'},
        }}
      >
        Read details
      </Button>
    </Box>
  )
}
