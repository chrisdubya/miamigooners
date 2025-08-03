import {Box, Card, CardContent, CardMedia, Typography, Button, Container} from '@mui/material'
import {GetServerSideProps} from 'next'
import Link from 'next/link'
import Head from 'next/head'
import {Footer} from '../../src/Footer'
import {getProducts, ShopifyProduct, formatPrice} from '../../src/utils/shopify'

export const getServerSideProps = (async () => {
  const products = await getProducts()
  return {props: {products}}
}) satisfies GetServerSideProps<{products: ShopifyProduct[]}>

export default function Store({products}: {products: ShopifyProduct[]}) {
  return (
    <>
      <Head>
        <title>Shop - Miami Gooners</title>
        <meta name="description" content="Official Miami Gooners Shop" />
      </Head>
      
      <Container maxWidth="lg" style={{paddingTop: 32, paddingBottom: 32}}>
        <Box component="div" sx={{marginBottom: 4}}>
          <Typography variant="h2" component="h1" gutterBottom color="#dc0714" fontWeight="bold">
            Miami Gooners Shop
          </Typography>
        </Box>

        <Box component="div" sx={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 3}}>
          {products.map((product) => {
            const primaryImage = product.images.edges[0]?.node
            const price = product.priceRange.minVariantPrice
            
            return (
              <Card key={product.id} style={{height: '100%', display: 'flex', flexDirection: 'column'}}>
                <CardMedia
                  component="img"
                  height="300"
                  image={primaryImage?.url || '/images/placeholder-tshirt.svg'}
                  alt={primaryImage?.altText || product.title}
                  style={{objectFit: 'cover'}}
                />
                <CardContent style={{flexGrow: 1, display: 'flex', flexDirection: 'column'}}>
                  <Typography gutterBottom variant="h5" component="h2">
                    {product.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" marginBottom={2} flexGrow={1}>
                    {product.description}
                  </Typography>
                  <Box component="div" sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                    <Typography variant="h6" color="primary" fontWeight="bold">
                      {formatPrice(price.amount, price.currencyCode)}
                    </Typography>
                    <Link href={`/store/${product.handle}`} passHref>
                      <Button variant="contained" color="primary">
                        View Details
                      </Button>
                    </Link>
                  </Box>
                </CardContent>
              </Card>
            )
          })}
        </Box>

        <Box component="div" sx={{marginTop: 6, textAlign: 'center'}}>
          <Link href="/" passHref>
            <Button variant="outlined">
              Back to Home
            </Button>
          </Link>
        </Box>
      </Container>

      <Footer />
    </>
  )
}