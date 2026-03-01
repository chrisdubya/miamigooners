'use client'
import {Container, Skeleton, Box} from '@mui/material'
import Grid from '@mui/material/Grid2'

export function EventsSkeleton() {
  return (
    <Container>
      <Box sx={{display: 'flex', flexDirection: 'column', gap: 2, pt: 8}}>
        <Skeleton variant="text" width="60%" height={48} />
        <Skeleton variant="text" width="80%" height={28} />
        <Skeleton variant="text" width={240} height={40} />
        <Grid container spacing={2} mt={2}>
          {Array.from({length: 6}).map((_, i) => (
            <Grid key={i} size={{xs: 12, md: 6}}>
              <Skeleton
                variant="rectangular"
                height={280}
                sx={{
                  borderRadius: '12px',
                  bgcolor: '#1A1A1E',
                }}
              />
            </Grid>
          ))}
        </Grid>
      </Box>
    </Container>
  )
}
