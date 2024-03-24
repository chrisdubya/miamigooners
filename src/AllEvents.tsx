import {
  Container,
  Box,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material'
import Grid from '@mui/material/Unstable_Grid2'
import {Event} from './Event'
import {DateTime} from 'luxon'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import {EventType} from '../types'

export const AllEvents = ({events}: {events: EventType[]}) => {
  return (
    <Container>
      <Box component="div" mb={8}>
        <Accordion
          defaultExpanded={true}
          sx={{
            bgcolor: 'transparent',
            backgroundImage: 'none',
            boxShadow: 'none',
          }}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon color="primary" />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography variant="h3" gutterBottom color={'primary'} mt={4}>
              Upcoming Events
            </Typography>
          </AccordionSummary>

          <AccordionDetails>
            <Grid container spacing={2} mt={2}>
              {events?.length ? (
                events
                  .filter((val) => {
                    const eventDate = DateTime.fromFormat(
                      val.DateUtc,
                      "yyyy-MM-dd HH:mm:ss'Z'",
                      {
                        zone: 'utc',
                      }
                    ).setZone('America/New_York')

                    const today = DateTime.now().setZone('America/New_York')

                    return eventDate.toISODate() >= today.toISODate()
                  })
                  .sort((a, b) => {
                    const dateA = DateTime.fromFormat(
                      a.DateUtc,
                      "yyyy-MM-dd HH:mm:ss'Z'",
                      {
                        zone: 'utc',
                      }
                    ).setZone('America/New_York')

                    const dateB = DateTime.fromFormat(
                      b.DateUtc,
                      "yyyy-MM-dd HH:mm:ss'Z'",
                      {
                        zone: 'utc',
                      }
                    ).setZone('America/New_York')

                    return dateA.toMillis() - dateB.toMillis()
                  })
                  .map((event, index) => (
                    <Event key={index} index={index} event={event} />
                  ))
              ) : (
                <Typography variant="h5" gutterBottom color={'#fff'} ml={1}>
                  loading...
                </Typography>
              )}
            </Grid>
          </AccordionDetails>
        </Accordion>

        <Accordion
          sx={{
            bgcolor: 'transparent',
            backgroundImage: 'none',
            boxShadow: 'none',
          }}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon color="primary" />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography variant="h3" gutterBottom color={'primary'} mt={4}>
              Past Events
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={2} mt={2}>
              {events?.length ? (
                events
                  .filter(
                    (val) =>
                      DateTime.fromFormat(
                        val.DateUtc,
                        "yyyy-MM-dd HH:mm:ss'Z'",
                        {
                          zone: 'utc',
                        }
                      )
                        .setZone('America/New_York')
                        .toISODate() < DateTime.now().toISODate()
                  )
                  .sort((a, b) => {
                    const dateA = DateTime.fromFormat(
                      a.DateUtc,
                      "yyyy-MM-dd HH:mm:ss'Z'",
                      {
                        zone: 'utc',
                      }
                    )
                    const dateB = DateTime.fromFormat(
                      b.DateUtc,
                      "yyyy-MM-dd HH:mm:ss'Z'",
                      {
                        zone: 'utc',
                      }
                    )
                    return dateB.toMillis() - dateA.toMillis()
                  })
                  .map((event, index) => (
                    <Event
                      key={index}
                      index={index}
                      event={event}
                      past={true}
                    />
                  ))
              ) : (
                <Typography variant="h5" gutterBottom color={'#fff'} ml={1}>
                  loading...
                </Typography>
              )}
            </Grid>
          </AccordionDetails>
        </Accordion>
      </Box>
    </Container>
  )
}
