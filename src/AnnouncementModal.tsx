'use client'
import {Dialog, DialogTitle, DialogContent, DialogActions, IconButton, Button, Typography, Box} from '@mui/material'
import {Close} from '@mui/icons-material'
import {useEffect, useState} from 'react'
import {Confetti} from './Confetti'
import {doppler, inter} from './font'

const STORAGE_KEY = 'miami-gooners-announcement-psg-2026-05-30-v1-dismissed'
export const ANNOUNCEMENT_EXPIRY = new Date('2026-05-30T20:00:00Z').getTime()
export const ANNOUNCEMENT_OPEN_EVENT = 'miami-gooners:open-announcement'

export const AnnouncementModal = () => {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (Date.now() > ANNOUNCEMENT_EXPIRY) return
    try {
      if (localStorage.getItem(STORAGE_KEY) === 'true') return
    } catch {
      // localStorage unavailable (Safari private mode, etc.) — still show the popup
    }
    setOpen(true)
  }, [])

  useEffect(() => {
    const handler = () => {
      if (Date.now() > ANNOUNCEMENT_EXPIRY) return
      setOpen(true)
    }
    window.addEventListener(ANNOUNCEMENT_OPEN_EVENT, handler)
    return () => window.removeEventListener(ANNOUNCEMENT_OPEN_EVENT, handler)
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
    <>
      <Confetti active={open} />
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
            fontSize: {xs: '1.5rem', sm: '2rem'},
            fontWeight: 700,
            lineHeight: 1.1,
          }}
        >
          🚨ucl final saturday🚨
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
          Saturday is the biggest day in Arsenal’s modern history as we watch the boys go for the Champions League
          trophy against PSG, and we are expecting our largest turnout ever at The Bar.
        </Typography>
        <Typography paragraph sx={{fontFamily: inter.style.fontFamily}}>
          Kickoff is at <Box component="span" sx={{fontWeight: 700}}>12:00 PM</Box>. Doors for admission will open at{' '}
          <Box component="span" sx={{fontWeight: 700}}>11:30 AM sharp</Box>. Because of capacity limitations (roughly
          200 total), entry will be <Box component="span" sx={{fontWeight: 700}}>FIRST COME, FIRST SERVED</Box>.
        </Typography>
        <Typography paragraph sx={{fontFamily: inter.style.fontFamily}}>
          The Bar will have the game on inside, on the back patio, and on the 65’’ TV in the front window for overflow
          viewing on Giralda.
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
          <li>No pets for this match.</li>
          <li>We strongly caution against bringing young children due to the expected crowd size and atmosphere.</li>
        </Box>
        <Typography paragraph sx={{fontFamily: inter.style.fontFamily}}>
          We’ve worked closely with the team at The Bar to maximize capacity and create the best possible experience for
          the community while keeping everyone safe.
        </Typography>
        <Typography paragraph sx={{fontFamily: inter.style.fontFamily}}>
          One match away from the European crown.{' '}
          <Box component="span" sx={{fontWeight: 700, color: '#D4A843'}}>
            LET’S FUCKING PARTY!!!! ❤️🏆🤍
          </Box>
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} variant="contained" color="primary">
          Got It
        </Button>
      </DialogActions>
      </Dialog>
    </>
  )
}
