import {getMatchPhotos} from '../../../src/utils/googleDrive'

export const revalidate = 300

export async function GET() {
  try {
    const data = await getMatchPhotos()
    return Response.json(data)
  } catch (e) {
    console.error('Drive API error:', e)
    return Response.json(
      {error: 'Error fetching photos from Drive'},
      {status: 500}
    )
  }
}
