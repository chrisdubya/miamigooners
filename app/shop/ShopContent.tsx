'use client'
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Container,
} from '@mui/material'
import Link from 'next/link'
import {Footer} from '../../src/Footer'
import {ShopHero} from '../../src/ShopHero'
import {ShopifyProduct, formatPrice} from '../../src/utils/shopify'
import {doppler} from '../../src/font'
import {ArrowForward} from '@mui/icons-material'

export default function ShopContent({products}: {products: ShopifyProduct[]}) {
  return (
    <>
      <ShopHero />

      <Container maxWidth="lg" sx={{pt: 4, pb: 4}}>
        {products.length === 0 ? (
          <Box component="div" sx={{textAlign: 'center', padding: 8}}>
            <Typography variant="h4" color="text.secondary" gutterBottom>
              No items available
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Check back soon for new merchandise!
            </Typography>
          </Box>
        ) : (
          <Box
            component="div"
            sx={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
              gap: 3,
            }}
          >
            {products.map((product) => {
              const primaryImage = product.images.edges[0]?.node
              const price = product.priceRange.minVariantPrice

              return (
                <Link
                  key={product.id}
                  href={`/shop/${product.handle}`}
                  style={{textDecoration: 'none'}}
                >
                  <Card
                    sx={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      overflow: 'hidden',
                      cursor: 'pointer',
                      '& .product-image': {
                        transition: 'transform 400ms ease',
                      },
                      '&:hover .product-image': {
                        transform: 'scale(1.05)',
                      },
                      '&:hover .product-overlay': {
                        opacity: 1,
                      },
                    }}
                  >
                    <Box sx={{position: 'relative', overflow: 'hidden'}}>
                      <CardMedia
                        component="img"
                        className="product-image"
                        image={
                          primaryImage?.url ||
                          '/images/placeholder-tshirt.svg'
                        }
                        alt={primaryImage?.altText || product.title}
                        sx={{
                          aspectRatio: '4 / 5',
                          objectFit: 'cover',
                          backgroundColor: '#1A1A1E',
                        }}
                      />
                      <Box
                        className="product-overlay"
                        sx={{
                          position: 'absolute',
                          inset: 0,
                          bgcolor: 'rgba(0,0,0,0.5)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          opacity: 0,
                          transition: 'opacity 0.3s ease',
                        }}
                      >
                        <Typography
                          variant="button"
                          sx={{color: 'white', letterSpacing: '0.1em'}}
                        >
                          View Details
                        </Typography>
                      </Box>
                    </Box>

                    <CardContent
                      sx={{
                        flexGrow: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        p: 3,
                      }}
                    >
                      <Typography
                        gutterBottom
                        component="h2"
                        sx={{
                          fontFamily: doppler.style.fontFamily,
                          fontWeight: 600,
                          fontSize: '1.25rem',
                          color: 'text.primary',
                          textTransform: 'lowercase',
                        }}
                      >
                        {product.title}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          mb: 2,
                          flexGrow: 1,
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                        }}
                      >
                        {product.description}
                      </Typography>

                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          pt: 2,
                          borderTop: '1px solid #2E2E38',
                          mt: 'auto',
                        }}
                      >
                        <Typography
                          sx={{
                            fontFamily: doppler.style.fontFamily,
                            fontWeight: 600,
                            fontSize: '1.125rem',
                            color: '#DB0007',
                            textTransform: 'lowercase',
                          }}
                        >
                          {formatPrice(price.amount, price.currencyCode)}
                        </Typography>
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 0.5,
                            color: 'text.secondary',
                            fontSize: '0.75rem',
                            fontWeight: 500,
                            letterSpacing: '0.1em',
                            textTransform: 'uppercase',
                            '&:hover': {color: 'text.primary'},
                            transition: 'color 200ms ease',
                          }}
                        >
                          VIEW
                          <ArrowForward sx={{fontSize: 14}} />
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Link>
              )
            })}
          </Box>
        )}
      </Container>

      <Footer />
    </>
  )
}
