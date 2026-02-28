import {getAllEvents} from '../../../src/utils/events'

export async function GET() {
  try {
    const allMatches = await getAllEvents()
    return Response.json(allMatches)
  } catch (e) {
    console.error(e)
    return Response.json(
      {error: 'Error fetching match details'},
      {status: 500}
    )
  }
}
