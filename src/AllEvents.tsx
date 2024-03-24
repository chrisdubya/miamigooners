import {
  Container,
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
      <div className="flex flex-col gap-4 pt-8">
        <h1 className="text-2xl md:text-4xl font-bold">
          The{' '}
          <a
            className="text-gooner-red hover:text-gooner-red-dark transition-colors duration-300"
            target={'_blank'}
            rel={'noopener noreferrer'}
            href={'https://www.arsenalamerica.com/branches/'}
          >
            official
          </a>{' '}
          Arsenal Supporters Branch in Miami, FL
        </h1>
        <h2 className="text-xl md:text-3xl font-bold">
          We watch all matches at{' '}
          <a
            className="text-gooner-red hover:text-gooner-red-dark transition-colors duration-300"
            target={'_blank'}
            rel={'noopener noreferrer'}
            href={`https://www.instagram.com/thebargables`}
          >
            the Bar
          </a>{' '}
          in Coral Gables. Follow our{' '}
          <a
            className="text-gooner-red hover:text-gooner-red-dark transition-colors duration-300"
            href={`https://www.instagram.com/miamigooners/`}
          >
            instagram
          </a>{' '}
          or{' '}
          <a
            className="text-gooner-red hover:text-gooner-red-dark transition-colors duration-300"
            href={`https://twitter.com/miamigooners`}
          >
            twitter/x
          </a>{' '}
          for the latest info. Come join us!
        </h2>
        <Accordion
          defaultExpanded={true}
          sx={{
            bgcolor: 'transparent',
            backgroundImage: 'none',
            boxShadow: 'none',
          }}
        >
          <AccordionSummary
            sx={{padding: 0}}
            expandIcon={<ExpandMoreIcon color="primary" />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography variant="h3" gutterBottom color={'primary'} mt={4}>
              Upcoming Matches
            </Typography>
          </AccordionSummary>

          <AccordionDetails sx={{padding: 0}}>
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
      </div>
    </Container>
  )
}
