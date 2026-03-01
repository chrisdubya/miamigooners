'use client'
import {useState, useMemo} from 'react'
import {
  Container,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Box,
  Chip,
} from '@mui/material'
import Grid from '@mui/material/Grid2'
import {Event} from './Event'
import {DateTime} from 'luxon'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import {EventType} from '../types'
import {doppler} from './font'

const COMPETITION_FILTERS = [
  'All',
  'Premier League',
  'UEFA Champions League',
  'FA Cup',
  'Carabao Cup',
] as const

type FilterType = (typeof COMPETITION_FILTERS)[number]

export const AllEvents = ({events}: {events: EventType[]}) => {
  const [filter, setFilter] = useState<FilterType>('All')

  const now = DateTime.now().setZone('America/New_York')

  const parseDate = (dateUtc: string) =>
    DateTime.fromFormat(dateUtc, "yyyy-MM-dd HH:mm:ss'Z'", {
      zone: 'utc',
    }).setZone('America/New_York')

  const {upcomingEvents, pastEvents} = useMemo(() => {
    const upcoming: EventType[] = []
    const past: EventType[] = []

    events.forEach((event) => {
      const eventDate = parseDate(event.DateUtc)
      const todayISO = now.toISODate()
      const eventISO = eventDate.toISODate()
      if (eventISO && todayISO && eventISO >= todayISO) {
        upcoming.push(event)
      } else {
        past.push(event)
      }
    })

    upcoming.sort(
      (a, b) => parseDate(a.DateUtc).toMillis() - parseDate(b.DateUtc).toMillis()
    )
    past.sort(
      (a, b) => parseDate(b.DateUtc).toMillis() - parseDate(a.DateUtc).toMillis()
    )

    return {upcomingEvents: upcoming, pastEvents: past}
  }, [events])

  const filterEvents = (list: EventType[]) => {
    if (filter === 'All') return list
    return list.filter((e) => e.competition === filter)
  }

  const COMPETITIONS_WITH_RESULTS = ['Premier League', 'UEFA Champions League']

  const filteredUpcoming = filterEvents(upcomingEvents)
  const filteredPast = filterEvents(pastEvents).filter((e) =>
    e.competition != null && COMPETITIONS_WITH_RESULTS.includes(e.competition)
  )

  return (
    <Container id="matches">
      <Box sx={{display: 'flex', flexDirection: 'column', gap: 2, pt: {xs: 6, md: 8}, pb: {xs: 8, md: 12}}}>
        {/* Intro text */}
        <Typography
          component="h2"
          sx={{
            fontFamily: doppler.style.fontFamily,
            fontWeight: 400,
            fontSize: {xs: '1.25rem', md: '1.5rem'},
            lineHeight: 1.2,
            color: 'text.secondary',
            textTransform: 'lowercase',
          }}
        >
          The{' '}
          <a
            style={{color: '#DB0007', textDecoration: 'underline'}}
            target="_blank"
            rel="noopener noreferrer"
            href="https://www.arsenalamerica.com/branches/"
          >
            official
          </a>{' '}
          Arsenal Supporters Branch in Miami, FL
        </Typography>
        <Typography
          sx={{
            fontSize: {xs: '1rem', md: '1.125rem'},
            lineHeight: 1.6,
            color: 'text.secondary',
          }}
        >
          We watch all matches at{' '}
          <a
            style={{color: '#DB0007', textDecoration: 'underline'}}
            target="_blank"
            rel="noopener noreferrer"
            href="https://www.instagram.com/thebargables"
          >
            the Bar
          </a>{' '}
          in Coral Gables. Follow our{' '}
          <a
            style={{color: '#DB0007', textDecoration: 'underline'}}
            href="https://www.instagram.com/miamigooners/"
          >
            Instagram
          </a>{' '}
          or{' '}
          <a
            style={{color: '#DB0007', textDecoration: 'underline'}}
            href="https://twitter.com/miamigooners"
          >
            X
          </a>{' '}
          for the latest info. Come join us!
        </Typography>

        {/* Competition filter chips */}
        <Box sx={{display: 'flex', gap: 1, flexWrap: 'wrap', mt: 2}}>
          {COMPETITION_FILTERS.map((comp) => (
            <Chip
              key={comp}
              label={comp}
              onClick={() => setFilter(comp)}
              variant={filter === comp ? 'filled' : 'outlined'}
              sx={{
                backgroundColor:
                  filter === comp ? '#DB0007' : 'transparent',
                color: filter === comp ? '#fff' : '#A1A1AA',
                borderColor: '#3A3A46',
                '&:hover': {
                  backgroundColor:
                    filter === comp ? '#FF1A22' : 'rgba(219, 0, 7, 0.08)',
                },
              }}
            />
          ))}
        </Box>

        {/* UPCOMING MATCHES */}
        <Box sx={{mt: 4}}>
          <Typography
            component="h2"
            sx={{
              fontFamily: doppler.style.fontFamily,
              fontWeight: 700,
              fontSize: {xs: '1.5rem', md: '2rem'},
              letterSpacing: '0.02em',
              textTransform: 'lowercase',
              color: 'text.primary',
            }}
          >
            Upcoming Matches
          </Typography>
          <Box
            sx={{
              width: 80,
              height: 2,
              bgcolor: '#DB0007',
              mt: 1,
              mb: 4,
            }}
          />

          <Grid container spacing={2}>
            {filteredUpcoming.length ? (
              filteredUpcoming.map((event, index) => (
                <Event
                  key={`${event.DateUtc}-${event.HomeTeam}-${event.AwayTeam}`}
                  index={index}
                  event={event}
                />
              ))
            ) : (
              <Typography
                variant="h5"
                gutterBottom
                color="text.secondary"
                ml={1}
              >
                No upcoming matches
              </Typography>
            )}
          </Grid>
        </Box>

        {/* RECENT RESULTS */}
        {filteredPast.length > 0 && (
          <Accordion
            defaultExpanded={false}
            sx={{
              bgcolor: 'transparent',
              backgroundImage: 'none',
              boxShadow: 'none',
              mt: 4,
            }}
          >
            <AccordionSummary
              sx={{padding: 0}}
              expandIcon={<ExpandMoreIcon sx={{color: '#DB0007'}} />}
              aria-controls="past-results-content"
              id="past-results-header"
            >
              <Box>
                <Typography
                  component="span"
                  sx={{
                    fontFamily: doppler.style.fontFamily,
                    fontWeight: 700,
                    fontSize: {xs: '1.5rem', md: '2rem'},
                    letterSpacing: '0.02em',
                    textTransform: 'lowercase',
                    color: 'text.primary',
                    display: 'block',
                  }}
                >
                  Recent Results
                </Typography>
                <Box
                  sx={{
                    width: 80,
                    height: 2,
                    bgcolor: '#DB0007',
                    mt: 1,
                  }}
                />
              </Box>
            </AccordionSummary>

            <AccordionDetails sx={{padding: 0}}>
              <Grid container spacing={2} mt={2}>
                {filteredPast.map((event, index) => (
                  <Event
                    key={`${event.DateUtc}-${event.HomeTeam}-${event.AwayTeam}`}
                    index={index}
                    event={event}
                    past
                  />
                ))}
              </Grid>
            </AccordionDetails>
          </Accordion>
        )}
      </Box>
    </Container>
  )
}

