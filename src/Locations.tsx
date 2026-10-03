'use client'
import {useState} from 'react'
import {Box, Button, Chip, Container, Typography} from '@mui/material'
import {Directions, Map, Place} from '@mui/icons-material'
import {doppler} from './font'
import {
  LOCATIONS,
  WatchLocation,
  directionsUrl,
  fullAddress,
  mapEmbedUrl,
} from './constants/locations'

// The Google Maps embed sets its own cookies, so it only loads once the
// visitor asks for it (same approach as match videos in the photo gallery)
const LocationMap = ({location}: {location: WatchLocation}) => {
  const [loaded, setLoaded] = useState(false)

  return (
    <Box
      sx={{
        position: 'relative',
        aspectRatio: {xs: '16 / 10', md: '2 / 1'},
        backgroundColor: '#0A0A0B',
        borderTop: '1px solid #2E2E38',
      }}
    >
      {loaded ? (
        <Box
          component="iframe"
          src={mapEmbedUrl(location)}
          title={`Map of ${location.name}`}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
          sx={{position: 'absolute', inset: 0, width: '100%', height: '100%', border: 0}}
        />
      ) : (
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 1.5,
            px: 3,
            textAlign: 'center',
            backgroundImage:
              'radial-gradient(circle at center, rgba(219,0,7,0.12) 0%, transparent 70%)',
          }}
        >
          <Button
            variant="outlined"
            startIcon={<Map />}
            onClick={() => setLoaded(true)}
            sx={{
              color: '#FAFAFA',
              borderColor: '#2E2E38',
              '&:hover': {borderColor: '#DB0007', backgroundColor: 'rgba(219,0,7,0.08)'},
            }}
          >
            Show map
          </Button>
          <Typography variant="caption" sx={{color: '#71717A', maxWidth: 280}}>
            Loads Google Maps, which may set its own cookies.
          </Typography>
        </Box>
      )}
    </Box>
  )
}

const LocationCard = ({location}: {location: WatchLocation}) => (
  <Box
    sx={{
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: '#111113',
      border: '1px solid #2E2E38',
      borderRadius: 2,
      overflow: 'hidden',
    }}
  >
    <Box sx={{p: {xs: 3, md: 4}, display: 'flex', flexDirection: 'column', gap: 1.5, flexGrow: 1}}>
      <Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2}}>
        <Typography
          component="h3"
          sx={{
            fontFamily: doppler.style.fontFamily,
            textTransform: 'lowercase',
            fontSize: {xs: '1.5rem', md: '1.75rem'},
            lineHeight: 1.1,
          }}
        >
          <a
            href={location.url}
            target="_blank"
            rel="noopener noreferrer"
            style={{color: 'inherit', textDecoration: 'none'}}
          >
            {location.name}
          </a>
        </Typography>
        <Chip
          label={location.label}
          size="small"
          sx={{
            color: '#D4A843',
            borderColor: '#D4A843',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            fontSize: '0.7rem',
          }}
          variant="outlined"
        />
      </Box>
      <Typography variant="body2" sx={{color: '#71717A', textTransform: 'uppercase', letterSpacing: '0.1em'}}>
        {location.neighborhood}
      </Typography>
      <Box component="address" sx={{display: 'flex', gap: 1, fontStyle: 'normal', color: '#A1A1AA'}}>
        <Place sx={{fontSize: 20, color: '#DB0007', mt: '2px'}} />
        <Typography variant="body1">
          {location.street}
          <br />
          {location.city}, {location.region} {location.postalCode}
        </Typography>
      </Box>
      <Box sx={{mt: 'auto', pt: 1}}>
        <Button
          component="a"
          href={directionsUrl(location)}
          target="_blank"
          rel="noopener noreferrer"
          variant="contained"
          size="small"
          startIcon={<Directions />}
          aria-label={`Directions to ${location.name}, ${fullAddress(location)}`}
        >
          Directions
        </Button>
      </Box>
    </Box>
    <LocationMap location={location} />
  </Box>
)

const linkStyle = {color: '#DB0007', textDecoration: 'underline'}

export const Locations = () => (
  <Box component="section" id="locations" aria-labelledby="locations-heading">
    <Container sx={{pt: {xs: 6, md: 8}, pb: {xs: 2, md: 4}}}>
      <Typography
        variant="overline"
        component="p"
        sx={{color: '#D4A843', letterSpacing: '0.15em', lineHeight: 1.5, mb: 1}}
      >
        Official Arsenal Supporters Branch &middot; Miami, FL
      </Typography>
      <Typography
        id="locations-heading"
        component="h2"
        sx={{
          fontFamily: doppler.style.fontFamily,
          fontWeight: 700,
          fontSize: {xs: '1.5rem', md: '2rem'},
          letterSpacing: '0.02em',
          textTransform: 'lowercase',
          color: 'text.primary',
          margin: 0,
        }}
      >
        Where We Watch
      </Typography>
      <Box sx={{width: 80, height: 2, bgcolor: '#DB0007', mt: 1, mb: 3}} />
      <Typography
        sx={{
          fontSize: {xs: '1rem', md: '1.125rem'},
          lineHeight: 1.6,
          color: 'text.secondary',
          maxWidth: 760,
          mb: {xs: 4, md: 5},
        }}
      >
        Miami Gooners is the{' '}
        <a
          style={linkStyle}
          target="_blank"
          rel="noopener noreferrer"
          href="https://www.arsenalamerica.com/branches/"
        >
          official
        </a>{' '}
        Arsenal Supporters Branch in Miami. We watch every match at two
        locations: our home, The Bar in Coral Gables, and our satellite, The
        Leinster in Downtown Miami. Follow our{' '}
        <a style={linkStyle} href="https://www.instagram.com/miamigooners/">
          Instagram
        </a>{' '}
        or{' '}
        <a style={linkStyle} href="https://twitter.com/miamigooners">
          X
        </a>{' '}
        for the latest info. Come join us!
      </Typography>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {xs: '1fr', md: '1fr 1fr'},
          gap: {xs: 3, md: 4},
        }}
      >
        {LOCATIONS.map((location) => (
          <LocationCard key={location.id} location={location} />
        ))}
      </Box>
    </Container>
  </Box>
)
