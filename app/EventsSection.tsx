import {getAllEvents} from '../src/utils/events'
import {getMatchPhotos} from '../src/utils/googleDrive'
import {AllEvents} from '../src/AllEvents'

export async function EventsSection() {
  const [events, photosData] = await Promise.all([
    getAllEvents().catch(() => []),
    getMatchPhotos().catch(() => ({matches: [], stats: {totalFiles: 0, totalMatches: 0, contributors: 0, lastSync: ''}, sharedFolderLink: ''})),
  ])

  // Build a lookup: "opponent|date" → match ID for linking to photos
  const photoMatchMap: Record<string, string> = {}
  for (const match of photosData.matches) {
    if (match.files.length > 0) {
      photoMatchMap[`${match.opponent.toLowerCase()}|${match.date}`] = match.id
    }
  }

  return <AllEvents events={events} photoMatchMap={photoMatchMap} />
}
