import {createStorefrontApiClient} from '@shopify/storefront-api-client'

const client = createStorefrontApiClient({
  storeDomain: process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN!,
  apiVersion: '2024-10',
  publicAccessToken: process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN!,
})

export interface ShopifyProduct {
  id: string
  handle: string
  title: string
  description: string
  images: {
    edges: Array<{
      node: {
        url: string
        altText?: string
      }
    }>
  }
  variants: {
    edges: Array<{
      node: {
        id: string
        title: string
        price: {
          amount: string
          currencyCode: string
        }
        availableForSale: boolean
        selectedOptions: Array<{
          name: string
          value: string
        }>
      }
    }>
  }
  options: Array<{
    name: string
    values: string[]
  }>
  priceRange: {
    minVariantPrice: {
      amount: string
      currencyCode: string
    }
  }
}

export interface ShopifyCart {
  id: string
  checkoutUrl: string
  cost: {
    totalAmount: {
      amount: string
      currencyCode: string
    }
  }
  lines: {
    edges: Array<{
      node: {
        id: string
        quantity: number
        merchandise: {
          id: string
          title: string
          product: {
            title: string
          }
        }
      }
    }>
  }
}

const PRODUCTS_QUERY = `
  query getProducts($first: Int!) {
    products(first: $first) {
      edges {
        node {
          id
          handle
          title
          description
          images(first: 5) {
            edges {
              node {
                url
                altText
              }
            }
          }
          variants(first: 10) {
            edges {
              node {
                id
                title
                price {
                  amount
                  currencyCode
                }
                availableForSale
                selectedOptions {
                  name
                  value
                }
              }
            }
          }
          options {
            name
            values
          }
          priceRange {
            minVariantPrice {
              amount
              currencyCode
            }
          }
        }
      }
    }
  }
`

const PRODUCT_BY_HANDLE_QUERY = `
  query getProductByHandle($handle: String!) {
    productByHandle(handle: $handle) {
      id
      handle
      title
      description
      images(first: 10) {
        edges {
          node {
            url
            altText
          }
        }
      }
      variants(first: 20) {
        edges {
          node {
            id
            title
            price {
              amount
              currencyCode
            }
            availableForSale
            selectedOptions {
              name
              value
            }
          }
        }
      }
      options {
        name
        values
      }
      priceRange {
        minVariantPrice {
          amount
          currencyCode
        }
      }
    }
  }
`

const CREATE_CART_MUTATION = `
  mutation cartCreate($input: CartInput!) {
    cartCreate(input: $input) {
      cart {
        id
        checkoutUrl
        cost {
          totalAmount {
            amount
            currencyCode
          }
        }
        lines(first: 250) {
          edges {
            node {
              id
              quantity
              merchandise {
                ... on ProductVariant {
                  id
                  title
                  product {
                    title
                  }
                }
              }
            }
          }
        }
      }
      userErrors {
        field
        message
      }
    }
  }
`

export async function getProducts(): Promise<ShopifyProduct[]> {
  try {
    const {data} = await client.request(PRODUCTS_QUERY, {
      variables: {first: 10}
    })
    return data.products.edges.map((edge: any) => edge.node)
  } catch (error) {
    console.error('Error fetching products:', error)
    return []
  }
}

export async function getProductByHandle(handle: string): Promise<ShopifyProduct | null> {
  try {
    const {data} = await client.request(PRODUCT_BY_HANDLE_QUERY, {
      variables: {handle}
    })
    return data.productByHandle
  } catch (error) {
    console.error('Error fetching product:', error)
    return null
  }
}

export async function createCart(variantId: string, quantity: number = 1): Promise<ShopifyCart | null> {
  try {
    console.log('Creating cart with variantId:', variantId)
    
    const {data, errors} = await client.request(CREATE_CART_MUTATION, {
      variables: {
        input: {
          lines: [
            {
              merchandiseId: variantId,
              quantity
            }
          ]
        }
      }
    })
    
    if (errors) {
      console.error('GraphQL errors:', errors)
      return null
    }
    
    if (data.cartCreate.userErrors.length > 0) {
      console.error('Cart user errors:', data.cartCreate.userErrors)
      return null
    }
    
    console.log('Cart created successfully:', data.cartCreate.cart)
    return data.cartCreate.cart
  } catch (error) {
    console.error('Error creating cart:', error)
    return null
  }
}

export async function createCartWithMultipleItems(items: Array<{merchandiseId: string, quantity: number}>): Promise<ShopifyCart | null> {
  try {
    console.log('Creating cart with multiple items:', items)
    
    const {data, errors} = await client.request(CREATE_CART_MUTATION, {
      variables: {
        input: {
          lines: items
        }
      }
    })
    
    if (errors) {
      console.error('GraphQL errors:', errors)
      return null
    }
    
    if (data.cartCreate.userErrors.length > 0) {
      console.error('Cart user errors:', data.cartCreate.userErrors)
      return null
    }
    
    console.log('Cart created successfully:', data.cartCreate.cart)
    return data.cartCreate.cart
  } catch (error) {
    console.error('Error creating cart:', error)
    return null
  }
}

export function formatPrice(amount: string, currencyCode: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currencyCode,
  }).format(parseFloat(amount))
}