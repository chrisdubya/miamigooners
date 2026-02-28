'use client'
import {CartProvider} from '../src/context/CartContext'

export default function Providers({children}: {children: React.ReactNode}) {
  return <CartProvider>{children}</CartProvider>
}
