import {notFound} from 'next/navigation'
import {getProductByHandle} from '../../../src/utils/shopify'
import type {Metadata} from 'next'
import ProductDetailClient from './ProductDetailClient'

type Props = {
  params: Promise<{productId: string}>
}

export async function generateMetadata({params}: Props): Promise<Metadata> {
  const {productId} = await params
  const product = await getProductByHandle(productId)

  if (!product) {
    return {title: 'Product Not Found - Miami Gooners Shop'}
  }

  const productImage =
    product.images.edges[0]?.node.url || 'https://miamigooners.com/og-image.jpg'

  return {
    title: `${product.title} - Miami Gooners Shop`,
    description:
      product.description ||
      `Shop ${product.title} - Official Miami Gooners merchandise`,
    openGraph: {
      type: 'website',
      images: [productImage],
    },
    alternates: {
      canonical: `https://miamigooners.com/shop/${product.handle}`,
    },
  }
}

export default async function ProductDetailPage({params}: Props) {
  const {productId} = await params
  const product = await getProductByHandle(productId)

  if (!product) {
    notFound()
  }

  return <ProductDetailClient product={product} />
}
