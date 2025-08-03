import {Box, Card, CardContent, CardMedia, Typography, Button, Container, Grid, Chip, Select, MenuItem, FormControl, InputLabel} from '@mui/material'
import {GetServerSideProps} from 'next'
import Link from 'next/link'
import Head from 'next/head'
import {Footer} from '../../src/Footer'
import {ShopHero} from '../../src/ShopHero'
import {ProductImageGallery} from '../../src/ProductImageGallery'
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
  // Find the first available variant, fallback to first variant if none available
  const getFirstAvailableVariant = () => {
    const availableVariant = product.variants.edges.find(({node}) => node.availableForSale)?.node
    return availableVariant || product.variants.edges[0]?.node
  }
  
  const [selectedVariant, setSelectedVariant] = useState(getFirstAvailableVariant())
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
        window.location.href = cart.checkoutUrl
      } else {
        alert('Error creating cart. Please check the browser console for details.')
      }
    } catch (error) {
      setIsLoading(false)
      console.error('Add to cart error:', error)
      alert('Error adding to cart. Please check the browser console for details.')
    }
  }

  const productImages = product.images.edges.map(edge => edge.node)
  const price = selectedVariant?.price || product.priceRange.minVariantPrice

  return (
    <>
      <Head>
        <title>{`${product.title} - Miami Gooners Shop`}</title>
        <meta name="description" content={product.description} />
      </Head>
      
      <ShopHero />
      
      <Container maxWidth="lg" style={{paddingTop: 32, paddingBottom: 32}}>
        <Box component="div" sx={{marginBottom: 3}}>
          <Link href="/shop" passHref>
            <Button startIcon={<ArrowBack />} variant="outlined">
              Back to Shop
            </Button>
          </Link>
        </Box>

        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <ProductImageGallery images={productImages} productTitle={product.title} />
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
                    <InputLabel>Size</InputLabel>
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
                        <MenuItem 
                          key={variant.id} 
                          value={variant.id}
                          disabled={!variant.availableForSale}
                          sx={{
                            textDecoration: !variant.availableForSale ? 'line-through' : 'none',
                            opacity: !variant.availableForSale ? 0.6 : 1
                          }}
                        >
                          {variant.title} - {formatPrice(variant.price.amount, variant.price.currencyCode)}
                          {!variant.availableForSale && ' (Out of Stock)'}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>
              )}

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