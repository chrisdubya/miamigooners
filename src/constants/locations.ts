export type WatchLocation = {
  id: string
  name: string
  label: string
  street: string
  city: string
  region: string
  postalCode: string
  neighborhood: string
  url: string
}

// The Bar is our home; The Leinster is the satellite location downtown
export const LOCATIONS: WatchLocation[] = [
  {
    id: 'the-bar',
    name: 'The Bar',
    label: 'Home',
    street: '172 Giralda Ave',
    city: 'Coral Gables',
    region: 'FL',
    postalCode: '33134',
    neighborhood: 'Coral Gables',
    url: 'https://www.instagram.com/thebargables',
  },
  {
    id: 'the-leinster',
    name: 'The Leinster',
    label: 'Satellite',
    street: '1600 NE 1st Ave',
    city: 'Miami',
    region: 'FL',
    postalCode: '33132',
    neighborhood: 'Downtown Miami',
    url: 'https://theleinstermiami.com',
  },
]

export const fullAddress = (loc: WatchLocation) =>
  `${loc.street}, ${loc.city}, ${loc.region} ${loc.postalCode}`

const mapsQuery = (loc: WatchLocation) =>
  encodeURIComponent(`${loc.name}, ${fullAddress(loc)}`)

export const mapEmbedUrl = (loc: WatchLocation) =>
  `https://www.google.com/maps?q=${mapsQuery(loc)}&output=embed`

export const directionsUrl = (loc: WatchLocation) =>
  `https://www.google.com/maps/search/?api=1&query=${mapsQuery(loc)}`
