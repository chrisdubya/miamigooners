'use client'
import {Box} from '@mui/material'
import {PhotoCard} from './PhotoCard'
import type {PhotoItem} from './types/photos'

interface PhotoGridProps {
  photos: PhotoItem[]
  onOpen: (photo: PhotoItem) => void
}

export const PhotoGrid = ({photos, onOpen}: PhotoGridProps) => {
  return (
    <Box sx={{px: {xs: 2, md: 4}, py: {xs: 3, md: 5}, pb: {xs: 8, md: 10}}}>
      <Box
        sx={{
          maxWidth: 1200,
          mx: 'auto',
          display: 'grid',
          gridTemplateColumns: {xs: 'repeat(2, 1fr)', sm: 'repeat(3, 1fr)'},
          gridAutoRows: '8px',
          gap: 2,
        }}
      >
        {photos.map((p) => (
          <PhotoCard key={p.id} photo={p} onOpen={() => onOpen(p)} />
        ))}
      </Box>
    </Box>
  )
}
