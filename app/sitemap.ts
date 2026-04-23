import {MetadataRoute} from 'next'
import {createStorefrontApiClient} from '@shopify/storefront-api-client'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://miamigooners.com'
  let productHandles: string[] = []

  if (
    process.env.SHOPIFY_STORE_DOMAIN &&
    process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN
  ) {
    try {
      const client = createStorefrontApiClient({
        storeDomain: process.env.SHOPIFY_STORE_DOMAIN,
        apiVersion: '2026-01',
        publicAccessToken: process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN,
      })

      const query = `
        query GetProductHandles {
          products(first: 250) {
            edges {
              node {
                handle
              }
            }
          }
        }
      `

      const {data} = await client.request(query)

      if (data?.products?.edges) {
        productHandles = data.products.edges.map(
          (edge: any) => edge.node.handle
        )
      }
    } catch (error) {
      console.error('Error fetching products for sitemap:', error)
    }
  }

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/matchday-photos`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/shop`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    ...productHandles.map((handle) => ({
      url: `${baseUrl}/shop/${handle}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    })),
  ]
}
