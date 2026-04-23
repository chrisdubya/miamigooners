'use client'
import {useMemo} from 'react'
import {Box, Button, Card, Chip, Typography} from '@mui/material'
import {EventType} from '../types'
import Grid from '@mui/material/Grid2'
import {DateTime} from 'luxon'
import {teamColors} from './constants/teamColors'
import {doppler, jetbrainsMono} from './font'

interface EventProps {
  index: number
  event: EventType
  past?: boolean
  photoMatchId?: string
}

export const Event = ({index, event, past, photoMatchId}: EventProps) => {
  const formatDuration = (date: string) => {
    const futureDate = DateTime.fromFormat(date, "yyyy-MM-dd HH:mm:ss'Z'", {
      zone: 'utc',
    })
    const currentDate = DateTime.now()
    const diff = futureDate.diff(currentDate, 'days').toObject()

    if (diff?.days) {
      const daysDifference = Math.ceil(diff.days)
      if (daysDifference <= 0) return 'TODAY'
      if (daysDifference === 1) return '1 DAY'
      return `${daysDifference} DAYS`
    }
    return undefined
  }

  const formattedDateTime = useMemo(() => {
    const format = "yyyy-MM-dd HH:mm:ss'Z'"
    const dateTime = DateTime.fromFormat(event.DateUtc, format, {
      zone: 'utc',
    }).setZone('America/New_York')
    return dateTime.toFormat('EEEE, M/d h:mma')
  }, [event.DateUtc])

  const daysUntil = useMemo(() => {
    const futureDate = DateTime.fromFormat(
      event.DateUtc,
      "yyyy-MM-dd HH:mm:ss'Z'",
      {zone: 'utc'}
    )
    return Math.ceil(futureDate.diff(DateTime.now(), 'days').days)
  }, [event.DateUtc])

  const getTeamColor = (colorType: 'primary' | 'secondary') => {
    const team =
      event.HomeTeam === 'Arsenal' ? event.AwayTeam : event.HomeTeam
    const color = teamColors.find((item) => item.team === team)
    return colorType === 'primary' ? color?.primary : color?.secondary
  }

  const opponentName =
    event.AwayTeam === 'Arsenal' ? event.HomeTeam : event.AwayTeam
  const isHome = event.AwayTeam !== 'Arsenal'
  const teamColor = getTeamColor('primary') || '#3A3A46'

  const getResult = () => {
    const homeScore = event.HomeTeamScore
    const awayScore = event.AwayTeamScore
    if (homeScore == null || awayScore == null) return null

    const arsScore = event.HomeTeam === 'Arsenal' ? homeScore : awayScore
    const oppScore = event.HomeTeam === 'Arsenal' ? awayScore : homeScore

    if (arsScore > oppScore) return 'W'
    if (arsScore < oppScore) return 'L'
    if (event.winnerOnPenalties === 'Arsenal') return 'W'
    if (event.winnerOnPenalties) return 'L'
    return 'D'
  }

  const getScoreDisplay = () => {
    if (
      event.HomeTeamScore == null ||
      event.AwayTeamScore == null
    )
      return null
    if (event.AwayTeam === 'Arsenal') {
      return `${event.AwayTeamScore}  -  ${event.HomeTeamScore}`
    }
    return `${event.HomeTeamScore}  -  ${event.AwayTeamScore}`
  }

  const result = getResult()
  const scoreDisplay = getScoreDisplay()

  const resultColor =
    result === 'W'
      ? '#22C55E'
      : result === 'L'
        ? '#EF4444'
        : result === 'D'
          ? '#EAB308'
          : undefined

  return (
    <Grid size={{xs: 12, md: 6}}>
      <Card
        sx={{
          position: 'relative',
          overflow: 'hidden',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          opacity: past ? 0.7 : 1,
          transition: 'all 200ms ease',
          '&:hover': {
            opacity: 1,
            transform: 'translateY(-4px)',
            borderColor: '#3A3A46',
            boxShadow: `0 8px 25px rgba(0,0,0,0.4), 0 4px 10px rgba(0,0,0,0.3)`,
          },
        }}
      >
        {/* Color band */}
        <Box
          sx={{
            height: 6,
            width: '100%',
            backgroundColor: teamColor,
          }}
        />

        {/* Match header zone */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            px: 3,
            pt: 3,
          }}
        >
          {/* Competition badge */}
          {event.competition && (
            <Chip
              label={event.competition.toUpperCase()}
              size="small"
              sx={{
                fontSize: '0.7rem',
                fontWeight: 600,
                letterSpacing: '0.02em',
                color: '#D4A843',
                backgroundColor: 'rgba(212, 168, 67, 0.1)',
                height: 24,
                borderRadius: '4px',
              }}
            />
          )}

          {/* Countdown or Result badge */}
          {!past && (
            <Typography
              sx={{
                fontFamily: jetbrainsMono.style.fontFamily,
                fontSize: {xs: '0.75rem', md: '0.875rem'},
                fontWeight: 500,
                letterSpacing: '0.08em',
                color: '#DB0007',
                animation:
                  daysUntil <= 1
                    ? 'matchday-pulse 1s infinite'
                    : daysUntil <= 3
                      ? 'matchday-pulse 2s infinite'
                      : 'none',
              }}
            >
              {formatDuration(event.DateUtc)}
            </Typography>
          )}

          {past && result && (
            <Box
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: resultColor,
                color: '#fff',
                fontFamily: jetbrainsMono.style.fontFamily,
                fontWeight: 700,
                fontSize: '0.875rem',
                letterSpacing: '0.05em',
                borderRadius: '4px',
                px: 1,
                py: 0.5,
                minWidth: 28,
              }}
            >
              {result}
            </Box>
          )}
        </Box>

        {/* Opponent name zone */}
        <Box sx={{px: 3, pt: 1, pb: 1}}>
          <Box sx={{display: 'flex', alignItems: 'baseline', gap: 1}}>
            <Typography
              component="h3"
              sx={{
                fontFamily: doppler.style.fontFamily,
                fontWeight: 700,
                fontSize: {xs: '1.5rem', md: '2rem'},
                lineHeight: 1.15,
                letterSpacing: '0.02em',
                textTransform: 'lowercase',
                color: 'text.primary',
              }}
            >
              {opponentName}
            </Typography>
            <Typography
              sx={{
                fontSize: '0.75rem',
                fontWeight: 500,
                letterSpacing: '0.02em',
                textTransform: 'uppercase',
                color: 'text.tertiary',
              }}
            >
              ({isHome ? 'H' : 'A'})
            </Typography>
          </Box>
        </Box>

        {/* Score display (past events) */}
        {past && scoreDisplay && (
          <Box sx={{px: 3, pb: 1}}>
            <Typography
              sx={{
                fontFamily: jetbrainsMono.style.fontFamily,
                fontWeight: 700,
                fontSize: {xs: '1rem', md: '1.25rem'},
                letterSpacing: '0.05em',
                color: 'text.primary',
              }}
            >
              {scoreDisplay}
            </Typography>
          </Box>
        )}

        {/* Photos link */}
        {past && photoMatchId && (
          <Box sx={{px: 3, pb: 1}}>
            <Button
              component="a"
              href={`/matchday-photos?match=${photoMatchId}`}
              size="small"
              variant="outlined"
              sx={{
                color: '#A1A1AA',
                borderColor: '#2E2E38',
                fontSize: '0.75rem',
                fontWeight: 500,
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
                '&:hover': {
                  borderColor: '#DB0007',
                  color: '#F5F5F7',
                  backgroundColor: 'rgba(219, 0, 7, 0.08)',
                },
              }}
            >
              View Photos
            </Button>
          </Box>
        )}

        {/* Spacer to push details to bottom */}
        <Box sx={{flex: 1}} />

        {/* Match details zone */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            px: 3,
            pt: 2,
            pb: event.rsvpLink && !past ? 0 : 3,
            mt: 1,
            borderTop: '1px solid #2E2E38',
          }}
        >
          <Typography
            variant="body2"
            sx={{color: 'text.secondary', fontSize: '0.875rem'}}
          >
            {formattedDateTime}
          </Typography>
          <Typography
            variant="body2"
            sx={{color: '#71717A', fontSize: '0.875rem'}}
          >
            {event.Location}
          </Typography>
        </Box>

        {/* RSVP button */}
        {event.rsvpLink && !past && (
          <Box sx={{px: 3, pb: 3, pt: 2}}>
            <Button
              fullWidth
              variant="contained"
              color="primary"
              href={event.rsvpLink}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="RSVP for this match (opens in new tab)"
              sx={{
                animation: 'pulse-glow 2s infinite',
                '@media (prefers-reduced-motion: reduce)': {
                  animation: 'none',
                },
              }}
            >
              RSVP FOR THIS MATCH
            </Button>
          </Box>
        )}
      </Card>
    </Grid>
  )
}
