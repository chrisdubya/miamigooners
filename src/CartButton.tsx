import {Button, Badge} from '@mui/material'
import {ShoppingCart} from '@mui/icons-material'
import Link from 'next/link'
import {useCart} from './context/CartContext'

export const CartButton = () => {
  const { state } = useCart()

  return (
    <Link href="/shop/cart" passHref>
      <Button startIcon={
        <Badge badgeContent={state.totalQuantity} color="error" max={99}>
          <ShoppingCart />
        </Badge>
      } variant="outlined">
        Cart
      </Button>
    </Link>
  )
}