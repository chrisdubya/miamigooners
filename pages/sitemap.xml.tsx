import { GetServerSideProps } from 'next';
import { createStorefrontApiClient } from '@shopify/storefront-api-client';

function generateSiteMap(productHandles: string[]) {
  const baseUrl = 'https://miamigooners.com';

  return `<?xml version="1.0" encoding="UTF-8"?>
   <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
     <!-- Static pages -->
     <url>
       <loc>${baseUrl}</loc>
       <lastmod>${new Date().toISOString()}</lastmod>
       <changefreq>weekly</changefreq>
       <priority>1.0</priority>
     </url>
     <url>
       <loc>${baseUrl}/shop</loc>
       <lastmod>${new Date().toISOString()}</lastmod>
       <changefreq>daily</changefreq>
       <priority>0.8</priority>
     </url>
     <url>
       <loc>${baseUrl}/shop/cart</loc>
       <lastmod>${new Date().toISOString()}</lastmod>
       <changefreq>yearly</changefreq>
       <priority>0.3</priority>
     </url>
     <url>
       <loc>${baseUrl}/pass</loc>
       <lastmod>${new Date().toISOString()}</lastmod>
       <changefreq>monthly</changefreq>
       <priority>0.5</priority>
     </url>
     <!-- Dynamic product pages -->
     ${productHandles
       .map((handle) => {
         return `
     <url>
       <loc>${baseUrl}/shop/${handle}</loc>
       <lastmod>${new Date().toISOString()}</lastmod>
       <changefreq>weekly</changefreq>
       <priority>0.7</priority>
     </url>`;
       })
       .join('')}
   </urlset>
 `;
}

function SiteMap() {
  // getServerSideProps will do the heavy lifting
}

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  let productHandles: string[] = [];

  // Fetch product handles from Shopify if credentials are available
  if (process.env.SHOPIFY_STORE_DOMAIN && process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN) {
    try {
      const client = createStorefrontApiClient({
        storeDomain: process.env.SHOPIFY_STORE_DOMAIN,
        apiVersion: '2024-01',
        publicAccessToken: process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN,
      });

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
      `;

      const { data } = await client.request(query);

      if (data?.products?.edges) {
        productHandles = data.products.edges.map((edge: any) => edge.node.handle);
      }
    } catch (error) {
      console.error('Error fetching products for sitemap:', error);
    }
  }

  // Generate the XML sitemap
  const sitemap = generateSiteMap(productHandles);

  res.setHeader('Content-Type', 'text/xml');
  res.write(sitemap);
  res.end();

  return {
    props: {},
  };
};

export default SiteMap;