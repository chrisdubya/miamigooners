import {Box, Typography, Button, Container} from '@mui/material'
import Link from 'next/link'

export default function NotFound() {
  return (
    <Container maxWidth="sm">
      <Box
        component="div"
        sx={{
          textAlign: 'center',
          paddingY: 12,
          minHeight: '60vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        }}
      >
        <Typography variant="h1" color="primary" fontWeight="bold" gutterBottom>
          404
        </Typography>
        <Typography variant="h5" color="text.secondary" gutterBottom>
          Page not found
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{marginBottom: 4}}>
          The page you are looking for does not exist or has been moved.
        </Typography>
        <Link href="/">
          <Button variant="contained" color="primary" size="large">
            Go Home
          </Button>
        </Link>
      </Box>
    </Container>
  )
}
