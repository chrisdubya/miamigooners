'use client'
import {Container, Skeleton} from '@mui/material'
import Grid from '@mui/material/Grid2'

export function EventsSkeleton() {
  return (
    <Container>
      <div className="flex flex-col gap-4 pt-8">
        <Skeleton variant="text" width="60%" height={48} />
        <Skeleton variant="text" width="80%" height={28} />
        <Skeleton variant="text" width={240} height={40} />
        <Grid container spacing={2} mt={2}>
          {Array.from({length: 6}).map((_, i) => (
            <Grid key={i} size={{xs: 12, sm: 6, md: 4}}>
              <Skeleton
                variant="rectangular"
                height={200}
                sx={{borderRadius: 1}}
              />
            </Grid>
          ))}
        </Grid>
      </div>
    </Container>
  )
}
