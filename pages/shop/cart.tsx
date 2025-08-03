import {Box, Card, CardContent, CardMedia, Typography, Button, Container, IconButton, TextField, Divider} from '@mui/material'
import Head from 'next/head'
import Link from 'next/link'
import {Footer} from '../../src/Footer'
import {ShopHero} from '../../src/ShopHero'
import {ArrowBack, Delete, ShoppingCart, Remove, Add} from '@mui/icons-material'
import {useCart} from '../../src/context/CartContext'
import {formatPrice, createCartWithMultipleItems} from '../../src/utils/shopify'
import {useState} from 'react'

export default function Cart() {
  const { state, removeItem, updateQuantity, clearCart } = useCart()
  const [isLoading, setIsLoading] = useState(false)

  const handleCheckout = async () => {
    if (state.items.length === 0) {
      alert('Your cart is empty')
      return
    }

    setIsLoading(true)
    
    try {
      const cartItems = state.items.map(item => ({
        merchandiseId: item.variantId,
        quantity: item.quantity
      }))
      
      const cart = await createCartWithMultipleItems(cartItems)
      setIsLoading(false)
      
      if (cart) {
        window.location.href = cart.checkoutUrl
      } else {
        alert('Error creating cart. Please try again.')
      }
    } catch (error) {
      setIsLoading(false)
      console.error('Checkout error:', error)
      alert('Error during checkout. Please try again.')
    }
  }

  const handleQuantityChange = (variantId: string, newQuantity: number) => {
    if (newQuantity < 1) {
      removeItem(variantId)
    } else {
      updateQuantity(variantId, newQuantity)
    }
  }

  const subtotal = state.items.reduce((total, item) => {
    return total + (parseFloat(item.price.amount) * item.quantity)
  }, 0)

  if (state.items.length === 0) {
    return (
      <>
        <Head>
          <title>Shopping Cart - Miami Gooners Shop</title>
        </Head>
        
        <ShopHero />
        
        <Container maxWidth="lg" style={{paddingTop: 32, paddingBottom: 32, minHeight: '60vh'}}>
          <Box component="div" sx={{marginBottom: 3}}>
            <Link href="/shop" passHref>
              <Button startIcon={<ArrowBack />} variant="outlined">
                Back to Shop
              </Button>
            </Link>
          </Box>

          <Box component="div" sx={{textAlign: 'center', paddingY: 8}}>
            <ShoppingCart sx={{fontSize: 64, color: 'grey.400', marginBottom: 2}} />
            <Typography variant="h4" component="h1" gutterBottom>
              Your cart is empty
            </Typography>
            <Link href="/shop" passHref>
              <Button variant="contained" color="primary" size="large">
                Continue Shopping
              </Button>
            </Link>
          </Box>
        </Container>

        <Footer />
      </>
    )
  }

  return (
    <>
      <Head>
        <title>Shopping Cart ({state.totalQuantity}) - Miami Gooners Shop</title>
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

        <Typography variant="h3" component="h1" gutterBottom color="#dc0714" fontWeight="bold">
          Shopping Cart ({state.totalQuantity} items)
        </Typography>

        <Box component="div" sx={{display: 'flex', gap: 4, flexDirection: {xs: 'column', md: 'row'}}}>
          {/* Cart Items */}
          <Box component="div" sx={{flex: 1}}>
            {state.items.map((item) => (
              <Card key={item.variantId} sx={{marginBottom: 2}}>
                <CardContent>
                  <Box component="div" sx={{display: 'flex', gap: 2}}>
                    {item.image && (
                      <CardMedia
                        component="img"
                        sx={{width: 100, height: 100, objectFit: 'cover', borderRadius: 1}}
                        image={item.image.url}
                        alt={item.image.altText || item.productTitle}
                      />
                    )}
                    
                    <Box component="div" sx={{flex: 1}}>
                      <Typography variant="h6" component="h2" gutterBottom>
                        {item.productTitle}
                      </Typography>
                      
                      {item.variantTitle !== 'Default Title' && (
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          {item.variantTitle}
                        </Typography>
                      )}
                      
                      <Typography variant="body1" color="primary" fontWeight="bold" gutterBottom>
                        {formatPrice(item.price.amount, item.price.currencyCode)}
                      </Typography>
                      
                      {!item.availableForSale && (
                        <Typography variant="body2" color="error" gutterBottom>
                          Out of stock
                        </Typography>
                      )}
                      
                      {/* Quantity Controls */}
                      <Box component="div" sx={{display: 'flex', alignItems: 'center', gap: 1, marginTop: 2}}>
                        <IconButton 
                          size="small"
                          onClick={() => handleQuantityChange(item.variantId, item.quantity - 1)}
                        >
                          <Remove />
                        </IconButton>
                        
                        <TextField
                          type="number"
                          value={item.quantity}
                          onChange={(e) => handleQuantityChange(item.variantId, parseInt(e.target.value) || 0)}
                          inputProps={{ min: 0, style: { textAlign: 'center' } }}
                          sx={{ width: 80 }}
                          size="small"
                        />
                        
                        <IconButton 
                          size="small"
                          onClick={() => handleQuantityChange(item.variantId, item.quantity + 1)}
                        >
                          <Add />
                        </IconButton>
                        
                        <IconButton 
                          onClick={() => removeItem(item.variantId)}
                          sx={{marginLeft: 2, color: '#dc0714'}}
                        >
                          <Delete />
                        </IconButton>
                      </Box>
                    </Box>
                    
                    <Box component="div" sx={{textAlign: 'right'}}>
                      <Typography variant="h6" fontWeight="bold">
                        {formatPrice((parseFloat(item.price.amount) * item.quantity).toString(), item.price.currencyCode)}
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Box>

          {/* Order Summary */}
          <Box component="div" sx={{width: {xs: '100%', md: 300}}}>
            <Card>
              <CardContent>
                <Typography variant="h5" component="h2" gutterBottom fontWeight="bold">
                  Order Summary
                </Typography>
                
                <Box component="div" sx={{display: 'flex', justifyContent: 'space-between', marginBottom: 1}}>
                  <Typography variant="body1">
                    Subtotal ({state.totalQuantity} items)
                  </Typography>
                  <Typography variant="body1" fontWeight="bold">
                    {formatPrice(subtotal.toString(), state.items[0]?.price.currencyCode || 'USD')}
                  </Typography>
                </Box>
                
                <Typography variant="body2" color="text.secondary" marginBottom={2}>
                  Shipping and taxes calculated at checkout
                </Typography>
                
                <Divider sx={{marginY: 2}} />
                
                <Box component="div" sx={{display: 'flex', justifyContent: 'space-between', marginBottom: 3}}>
                  <Typography variant="h6" fontWeight="bold">
                    Total
                  </Typography>
                  <Typography variant="h6" fontWeight="bold">
                    {formatPrice(subtotal.toString(), state.items[0]?.price.currencyCode || 'USD')}
                  </Typography>
                </Box>
                
                <Button 
                  variant="contained" 
                  color="primary" 
                  size="large" 
                  fullWidth
                  startIcon={<ShoppingCart />}
                  onClick={handleCheckout}
                  disabled={isLoading || state.items.some(item => !item.availableForSale)}
                  sx={{marginBottom: 2}}
                >
                  {isLoading ? 'Processing...' : 'Proceed to Checkout'}
                </Button>
                
                <Button 
                  variant="outlined" 
                  size="small" 
                  fullWidth
                  onClick={clearCart}
                  sx={{color: '#dc0714', borderColor: '#dc0714', '&:hover': {borderColor: '#dc0714', backgroundColor: 'rgba(220, 7, 20, 0.04)'}}}
                >
                  Clear Cart
                </Button>
              </CardContent>
            </Card>
          </Box>
        </Box>
      </Container>

      <Footer />
    </>
  )
}