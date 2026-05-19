'use client'
import {Dialog, DialogTitle, DialogContent, DialogActions, IconButton, Button, Typography, Box} from '@mui/material'
import {Close} from '@mui/icons-material'
import {useEffect, useState} from 'react'
import {doppler, inter} from './font'

const STORAGE_KEY = 'miami-gooners-announcement-crystal-palace-2026-05-24-dismissed'
const EXPIRY = new Date('2026-05-24T22:00:00Z').getTime()

export const AnnouncementModal = () => {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (Date.now() > EXPIRY) return
    try {
      if (localStorage.getItem(STORAGE_KEY) === 'true') return
    } catch {
      // localStorage unavailable (Safari private mode, etc.) — still show the popup
    }
    setOpen(true)
  }, [])

  const handleClose = () => {
    setOpen(false)
    try {
      localStorage.setItem(STORAGE_KEY, 'true')
    } catch {
      // ignore
    }
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      scroll="paper"
      aria-labelledby="announcement-dialog-title"
    >
      <DialogTitle id="announcement-dialog-title" sx={{paddingRight: 6, pb: 1}}>
        <Typography
          component="div"
          sx={{
            fontFamily: doppler.style.fontFamily,
            textTransform: 'lowercase',
            color: '#fff',
            fontSize: {xs: '1.75rem', sm: '2.25rem'},
            fontWeight: 700,
            lineHeight: 1.1,
          }}
        >
          must read for sunday, 5/24
        </Typography>
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <Close />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers sx={{fontFamily: inter.style.fontFamily}}>
        <Typography paragraph sx={{fontFamily: inter.style.fontFamily}}>
          Sunday has the potential to be one of the biggest days in Arsenal history, and we are expecting an absolutely
          gargantuan turnout at The Bar.
        </Typography>
        <Typography paragraph sx={{fontFamily: inter.style.fontFamily}}>
          Doors for general admission will open at <Box component="span" sx={{fontWeight: 700}}>10:30 AM sharp</Box>. Because of capacity limitations, entry will be{' '}
          <Box component="span" sx={{fontWeight: 700}}>FIRST COME, FIRST SERVED</Box> — with a hard capacity enforced.
        </Typography>
        <Typography paragraph sx={{fontFamily: inter.style.fontFamily}}>
          The Bar will have the game on inside, on the back patio, and also is installing a new 65’’ TV in the front
          window for overflow viewing on Giralda.
        </Typography>
        <Typography
          paragraph
          sx={{
            fontFamily: inter.style.fontFamily,
            fontWeight: 700,
            color: '#DB0007',
          }}
        >
          ENTRY WILL BE THROUGH THE FRONT DOOR ONLY AND THERE WILL BE BOUNCERS ENFORCING CAPACITY. AN ORDERLY LINE MUST
          BE FORMED TO ENSURE FAIR ENTRY.
        </Typography>
        <Typography sx={{fontFamily: inter.style.fontFamily, fontWeight: 600, mb: 1}}>
          A few important notes for everyone attending:
        </Typography>
        <Box
          component="ul"
          sx={{
            fontFamily: inter.style.fontFamily,
            listStyle: 'none',
            pl: 0,
            m: 0,
            mb: 2,
            '& li': {
              position: 'relative',
              pl: 3,
              mb: 1.25,
              lineHeight: 1.5,
            },
            '& li::before': {
              content: '""',
              position: 'absolute',
              left: 4,
              top: '0.6em',
              width: 8,
              height: 8,
              borderRadius: '50%',
              backgroundColor: '#DB0007',
              boxShadow: '0 0 0 2px rgba(219, 0, 7, 0.2)',
            },
          }}
        >
          <li>Capacity is extremely limited and once we are full, we are full. Please arrive early.</li>
          <li>There will be virtually no seating in order to make room for extra capacity.</li>
          <li>Only Arsenal supporters will be allowed entry.</li>
          <li>No pets for these final two matches.</li>
          <li>We strongly caution against bringing young children due to the expected crowd size and atmosphere.</li>
        </Box>
        <Typography paragraph sx={{fontFamily: inter.style.fontFamily}}>
          We’ve worked closely with the team at The Bar to maximize capacity and create the best possible experience for
          the community while keeping everyone safe.
        </Typography>
        <Typography paragraph sx={{fontFamily: inter.style.fontFamily}}>
          This season has been special. Let’s make Sunday unforgettable.
        </Typography>
        <Typography
          sx={{
            fontFamily: doppler.style.fontFamily,
            textTransform: 'lowercase',
            color: '#D4A843',
            textAlign: 'center',
            fontSize: {xs: '1.5rem', sm: '1.75rem'},
            letterSpacing: '0.05em',
            mt: 3,
          }}
        >
          victory through harmony
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} variant="contained" color="primary">
          Got It
        </Button>
      </DialogActions>
    </Dialog>
  )
}
