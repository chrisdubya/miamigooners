'use client'
import {Auth0Provider} from '@auth0/nextjs-auth0/client'
import {CartProvider} from '../src/context/CartContext'

export default function Providers({children}: {children: React.ReactNode}) {
  return (
    <Auth0Provider>
      <CartProvider>{children}</CartProvider>
    </Auth0Provider>
  )
}
