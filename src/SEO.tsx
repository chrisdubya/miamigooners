import Head from 'next/head'

const BASE_URL = 'https://miamigooners.com'
const DEFAULT_IMAGE = `${BASE_URL}/og-image.jpg`
const SITE_NAME = 'Miami Gooners'

interface SEOProps {
  title?: string
  description?: string
  image?: string
  url?: string
  type?: 'website' | 'article' | 'product'
  noindex?: boolean
  jsonLd?: Record<string, unknown> | Record<string, unknown>[]
}

export function SEO({
  title,
  description,
  image = DEFAULT_IMAGE,
  url,
  type = 'website',
  noindex = false,
  jsonLd,
}: SEOProps) {
  const fullUrl = url ? `${BASE_URL}${url.startsWith('/') ? url : `/${url}`}` : BASE_URL

  return (
    <Head>
      {title && <title>{title}</title>}
      {description && <meta name="description" content={description} />}

      {/* Canonical URL */}
      <link rel="canonical" href={fullUrl} />

      {/* Robots */}
      {noindex && <meta name="robots" content="noindex, nofollow" />}

      {/* Open Graph */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={fullUrl} />
      {title && <meta property="og:title" content={title} />}
      {description && <meta property="og:description" content={description} />}
      <meta property="og:image" content={image} />
      <meta property="og:site_name" content={SITE_NAME} />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={fullUrl} />
      {title && <meta name="twitter:title" content={title} />}
      {description && <meta name="twitter:description" content={description} />}
      <meta name="twitter:image" content={image} />

      {/* JSON-LD Structured Data */}
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(Array.isArray(jsonLd) ? jsonLd : jsonLd),
          }}
        />
      )}
    </Head>
  )
}

// Helper to generate Product schema
export function generateProductSchema(product: {
  name: string
  description: string
  image: string
  price: string
  currency: string
  availability: boolean
  url: string
  sku?: string
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: product.image,
    sku: product.sku,
    offers: {
      '@type': 'Offer',
      price: product.price,
      priceCurrency: product.currency,
      availability: product.availability
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
      url: product.url,
    },
  }
}

// Helper to generate Event schema for match watch parties
export function generateEventSchema(event: {
  name: string
  description: string
  startDate: string
  location: {
    name: string
    address?: string
  }
  image?: string
  url?: string
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'SportsEvent',
    name: event.name,
    description: event.description,
    startDate: event.startDate,
    location: {
      '@type': 'Place',
      name: event.location.name,
      address: event.location.address,
    },
    image: event.image || DEFAULT_IMAGE,
    url: event.url || BASE_URL,
    organizer: {
      '@type': 'SportsClub',
      name: SITE_NAME,
      url: BASE_URL,
    },
  }
}

// Helper to generate BreadcrumbList schema
export function generateBreadcrumbSchema(
  items: Array<{ name: string; url: string }>
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${BASE_URL}${item.url}`,
    })),
  }
}

// Organization schema (for global use)
export const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'SportsClub',
  name: 'Miami Gooners',
  url: BASE_URL,
  logo: DEFAULT_IMAGE,
  description: 'Official Arsenal FC Supporters Club in Miami, FL',
  sameAs: [
    'https://instagram.com/miamigooners',
    'https://twitter.com/miamigooners',
  ],
  location: {
    '@type': 'Place',
    name: 'The Bar Gables',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Miami',
      addressRegion: 'FL',
      addressCountry: 'US',
    },
  },
}
