import {getProducts} from '../../src/utils/shopify'
import type {Metadata} from 'next'
import ShopContent from './ShopContent'

export const metadata: Metadata = {
  title: 'Shop Official Merchandise - Miami Gooners',
  description:
    'Shop official Miami Gooners merchandise. Support the official Arsenal FC supporters club in Miami, FL with authentic gear, apparel, and accessories.',
  alternates: {
    canonical: 'https://miamigooners.com/shop',
  },
}

export default async function Shop() {
  const products = await getProducts()
  return <ShopContent products={products} />
}
