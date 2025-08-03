import {Box, Card, CardContent, CardMedia, Typography, Button, Container, Grid, Chip, Select, MenuItem, FormControl, InputLabel} from '@mui/material'
import {GetServerSideProps} from 'next'
import Link from 'next/link'
import Head from 'next/head'
import {Footer} from '../../src/Footer'
import {ArrowBack, ShoppingCart} from '@mui/icons-material'
import {getProductByHandle, ShopifyProduct, formatPrice, createCart} from '../../src/utils/shopify'
import {useState} from 'react'

export const getServerSideProps = (async (context) => {
  const {productId} = context.params!
  const product = await getProductByHandle(productId as string)
  
  if (!product) {
    return {
      notFound: true
    }
  }

  return {props: {product}}
}) satisfies GetServerSideProps<{product: ShopifyProduct}>

export default function ProductDetail({product}: {product: ShopifyProduct}) {
  const [selectedVariant, setSelectedVariant] = useState(product.variants.edges[0]?.node)
  const [isLoading, setIsLoading] = useState(false)

  const handleAddToCart = async () => {
    if (!selectedVariant) {
      alert('Please select a variant')
      return
    }
    
    setIsLoading(true)
    
    try {
      const cart = await createCart(selectedVariant.id)
      setIsLoading(false)
      
      if (cart) {
        window.open(cart.checkoutUrl, '_blank')
      } else {
        alert('Error creating cart. Please check the browser console for details.')
      }
    } catch (error) {
      setIsLoading(false)
      console.error('Add to cart error:', error)
      alert('Error adding to cart. Please check the browser console for details.')
    }
  }

  const primaryImage = product.images.edges[0]?.node
  const price = selectedVariant?.price || product.priceRange.minVariantPrice

  return (
    <>
      <Head>
        <title>{product.title} - Miami Gooners Store</title>
        <meta name="description" content={product.description} />
      </Head>
      
      <Container maxWidth="lg" style={{paddingTop: 32, paddingBottom: 32}}>
        <Box component="div" sx={{marginBottom: 3}}>
          <Link href="/store" passHref>
            <Button startIcon={<ArrowBack />} variant="outlined">
              Back to Store
            </Button>
          </Link>
        </Box>

        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardMedia
                component="img"
                image={primaryImage?.url || '/images/placeholder-tshirt.svg'}
                alt={primaryImage?.altText || product.title}
                style={{width: '100%', height: 'auto', maxHeight: 500, objectFit: 'cover'}}
              />
            </Card>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Box component="div" sx={{paddingLeft: {md: 2}}}>
              <Typography variant="h3" component="h1" gutterBottom color="#dc0714" fontWeight="bold">
                {product.title}
              </Typography>
              
              <Typography variant="h4" color="primary" marginBottom={3} fontWeight="bold">
                {formatPrice(price.amount, price.currencyCode)}
              </Typography>

              <Typography variant="body1" paragraph>
                {product.description}
              </Typography>

              {product.variants.edges.length > 1 && (
                <Box component="div" sx={{marginBottom: 2}}>
                  <FormControl fullWidth>
                    <InputLabel>Variant</InputLabel>
                    <Select
                      value={selectedVariant?.id || ''}
                      label="Variant"
                      onChange={(e) => {
                        const variant = product.variants.edges.find(edge => edge.node.id === e.target.value)?.node
                        if (variant) {
                          setSelectedVariant(variant)
                        }
                      }}
                    >
                      {product.variants.edges.map(({node: variant}) => (
                        <MenuItem key={variant.id} value={variant.id}>
                          {variant.title} - {formatPrice(variant.price.amount, variant.price.currencyCode)}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>
              )}

              {product.options.map((option) => (
                <Box key={option.name} component="div" sx={{marginBottom: 2}}>
                  <Typography variant="h6" gutterBottom>{option.name}</Typography>
                  <Box component="div" sx={{display: 'flex', gap: 1, flexWrap: 'wrap'}}>
                    {option.values.map((value) => (
                      <Chip key={value} label={value} variant="outlined" />
                    ))}
                  </Box>
                </Box>
              ))}


              {selectedVariant && !selectedVariant.availableForSale && (
                <Box component="div" sx={{marginBottom: 2}}>
                  <Typography variant="body2" color="error">
                    This variant is currently out of stock
                  </Typography>
                </Box>
              )}

              <Button 
                variant="contained" 
                color="primary" 
                size="large" 
                startIcon={<ShoppingCart />}
                onClick={handleAddToCart}
                disabled={!selectedVariant?.availableForSale || isLoading}
                style={{marginTop: 16}}
              >
                {isLoading ? 'Adding to Cart...' : 'Add to Cart'}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Container>

      <Footer />
    </>
  )
}