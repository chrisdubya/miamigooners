import type {Metadata} from 'next'
import {getMatchPhotos} from '../../src/utils/googleDrive'
import PhotosContent from './PhotosContent'

export const metadata: Metadata = {
  title: 'Matchday Photos - Miami Gooners',
  description:
    'Browse matchday photos from Miami Gooners watch parties at The Bar in Coral Gables.',
  alternates: {canonical: 'https://miamigooners.com/matchday-photos'},
}

export default async function MatchdayPhotos() {
  const data = await getMatchPhotos()
  return <PhotosContent data={data} />
}
