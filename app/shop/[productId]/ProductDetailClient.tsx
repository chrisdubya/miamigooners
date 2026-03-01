'use client'
import {
  Box,
  Typography,
  Button,
  Container,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material'
import Link from 'next/link'
import {Footer} from '../../../src/Footer'
import {ShopHero} from '../../../src/ShopHero'
import {ProductImageGallery} from '../../../src/ProductImageGallery'
import {CartButton} from '../../../src/CartButton'
import Grid from '@mui/material/Grid2'
import {ArrowBack, ShoppingCart} from '@mui/icons-material'
import {ShopifyProduct, formatPrice} from '../../../src/utils/shopify'
import {useState} from 'react'
import {useCart} from '../../../src/context/CartContext'

export default function ProductDetailClient({
  product,
}: {
  product: ShopifyProduct
}) {
  const {addItem} = useCart()

  const getFirstAvailableVariant = () => {
    const availableVariant = product.variants.edges.find(
      ({node}) => node.availableForSale
    )?.node
    return availableVariant || product.variants.edges[0]?.node
  }

  const [selectedVariant, setSelectedVariant] = useState(
    getFirstAvailableVariant()
  )
  const [isLoading, setIsLoading] = useState(false)
  const [isAdded, setIsAdded] = useState(false)

  const handleAddToCart = () => {
    if (!selectedVariant) {
      alert('Please select a variant')
      return
    }

    setIsLoading(true)

    const productImage = product.images.edges[0]?.node

    const cartItem = {
      variantId: selectedVariant.id,
      productId: product.id,
      productTitle: product.title,
      variantTitle: selectedVariant.title,
      price: selectedVariant.price,
      image: productImage
        ? {
            url: productImage.url,
            altText: productImage.altText || product.title,
          }
        : undefined,
      availableForSale: selectedVariant.availableForSale,
    }

    addItem(cartItem)
    setIsLoading(false)
    setIsAdded(true)

    setTimeout(() => {
      setIsAdded(false)
    }, 2000)
  }

  const productImages = product.images.edges.map((edge) => edge.node)
  const price =
    selectedVariant?.price || product.priceRange.minVariantPrice

  return (
    <>
      <ShopHero />

      <Container maxWidth="lg" sx={{pt: 4, pb: 4}}>
        <Box
          component="div"
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 3,
          }}
        >
          <Link href="/shop">
            <Button startIcon={<ArrowBack />} variant="outlined">
              Back to Shop
            </Button>
          </Link>
          <CartButton />
        </Box>

        <Grid container spacing={4}>
          <Grid size={{xs: 12, md: 6}}>
            <ProductImageGallery
              images={productImages}
              productTitle={product.title}
            />
          </Grid>

          <Grid size={{xs: 12, md: 6}}>
            <Box component="div" sx={{paddingLeft: {md: 2}}}>
              <Typography
                variant="h3"
                component="h1"
                gutterBottom
                color="primary"
                fontWeight="bold"
              >
                {product.title}
              </Typography>

              <Box
                component="div"
                sx={{
                  display: 'flex',
                  alignItems: 'baseline',
                  gap: 1,
                  marginBottom: 3,
                }}
              >
                <Typography variant="h4" color="primary" fontWeight="bold">
                  {formatPrice(price.amount, price.currencyCode)}
                </Typography>
                {!product.tags.includes('local-pickup') && (
                  <Typography variant="body1" color="text.secondary">
                    + shipping
                  </Typography>
                )}
              </Box>

              <Typography
                variant="body1"
                paragraph
                component="div"
                dangerouslySetInnerHTML={{__html: product.descriptionHtml}}
              />

              {product.variants.edges.length > 1 && (
                <Box component="div" sx={{marginBottom: 2}}>
                  <FormControl fullWidth>
                    <InputLabel>Size</InputLabel>
                    <Select
                      value={selectedVariant?.id || ''}
                      label="Size"
                      onChange={(e) => {
                        const variant = product.variants.edges.find(
                          (edge) => edge.node.id === e.target.value
                        )?.node
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
                            textDecoration: !variant.availableForSale
                              ? 'line-through'
                              : 'none',
                            opacity: !variant.availableForSale ? 0.6 : 1,
                          }}
                        >
                          {variant.title} -{' '}
                          {formatPrice(
                            variant.price.amount,
                            variant.price.currencyCode
                          )}
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
                color={isAdded ? 'success' : 'primary'}
                size="large"
                startIcon={<ShoppingCart />}
                onClick={handleAddToCart}
                disabled={
                  !selectedVariant?.availableForSale || isLoading || isAdded
                }
                sx={{mt: 2}}
              >
                {isLoading
                  ? 'Adding to Cart...'
                  : isAdded
                    ? 'Added!'
                    : 'Add to Cart'}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Container>

      <Footer />
    </>
  )
}
