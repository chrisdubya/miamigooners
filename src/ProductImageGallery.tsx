import {useState} from 'react'
import {Card, CardMedia, IconButton} from '@mui/material'
import {ArrowBack, ArrowForward} from '@mui/icons-material'

interface ProductImage {
  url: string
  altText?: string
}

interface ProductImageGalleryProps {
  images: ProductImage[]
  productTitle: string
}

export const ProductImageGallery = ({images, productTitle}: ProductImageGalleryProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  if (!images || images.length === 0) {
    return (
      <Card>
        <CardMedia
          component="img"
          image="/images/placeholder-tshirt.svg"
          alt={productTitle}
          style={{width: '100%', height: 'auto', maxHeight: 500, objectFit: 'cover'}}
        />
      </Card>
    )
  }

  const currentImage = images[currentImageIndex]
  const hasMultipleImages = images.length > 1

  const goToPrevious = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))
  }

  const goToNext = () => {
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))
  }

  const goToImage = (index: number) => {
    setCurrentImageIndex(index)
  }

  return (
    <div>
      {/* Main Image */}
      <Card style={{position: 'relative', marginBottom: 16}}>
        <CardMedia
          component="img"
          image={currentImage.url}
          alt={currentImage.altText || productTitle}
          style={{width: '100%', height: 'auto', maxHeight: 500, objectFit: 'cover'}}
        />
        
        {/* Navigation Arrows */}
        {hasMultipleImages && (
          <>
            <IconButton
              onClick={goToPrevious}
              sx={{
                position: 'absolute',
                left: 8,
                top: '50%',
                transform: 'translateY(-50%)',
                backgroundColor: 'rgba(0,0,0,0.5)',
                color: 'white',
                '&:hover': {
                  backgroundColor: 'rgba(0,0,0,0.7)',
                }
              }}
            >
              <ArrowBack />
            </IconButton>
            
            <IconButton
              onClick={goToNext}
              sx={{
                position: 'absolute',
                right: 8,
                top: '50%',
                transform: 'translateY(-50%)',
                backgroundColor: 'rgba(0,0,0,0.5)',
                color: 'white',
                '&:hover': {
                  backgroundColor: 'rgba(0,0,0,0.7)',
                }
              }}
            >
              <ArrowForward />
            </IconButton>

            {/* Image Counter */}
            <div
              style={{
                position: 'absolute',
                bottom: 8,
                right: 8,
                backgroundColor: 'rgba(0,0,0,0.7)',
                color: 'white',
                padding: '4px 8px',
                borderRadius: '4px',
                fontSize: '0.8rem'
              }}
            >
              {currentImageIndex + 1} / {images.length}
            </div>
          </>
        )}
      </Card>

      {/* Thumbnail Navigation */}
      {hasMultipleImages && (
        <div style={{display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 8}}>
          {images.map((image, index) => (
            <Card
              key={index}
              onClick={() => goToImage(index)}
              sx={{
                minWidth: 80,
                height: 80,
                cursor: 'pointer',
                border: currentImageIndex === index ? '2px solid #dc0714' : '2px solid transparent',
                '&:hover': {
                  border: '2px solid #dc0714',
                }
              }}
            >
              <CardMedia
                component="img"
                image={image.url}
                alt={image.altText || `${productTitle} ${index + 1}`}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }}
              />
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}