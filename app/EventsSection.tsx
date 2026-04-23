import {getAllEvents} from '../src/utils/events'
import {getMatchPhotos} from '../src/utils/googleDrive'
import {AllEvents} from '../src/AllEvents'

const teamNameAliases: Record<string, string> = {
  'bayern münchen': 'bayern munich',
  'atleti': 'atletico madrid',
}

function normalizeTeam(name: string): string {
  const lower = name.toLowerCase()
  return teamNameAliases[lower] ?? lower
}

export async function EventsSection() {
  const [events, photosData] = await Promise.all([
    getAllEvents().catch(() => []),
    getMatchPhotos().catch(() => ({matches: [], stats: {totalFiles: 0, totalMatches: 0, contributors: 0, lastSync: ''}, sharedFolderLink: ''})),
  ])

  // Build a lookup: "opponent|date" → match ID for linking to photos
  const photoMatchMap: Record<string, string> = {}
  for (const match of photosData.matches) {
    if (match.files.length > 0) {
      photoMatchMap[`${normalizeTeam(match.opponent)}|${match.date}`] = match.id
    }
  }

  return <AllEvents events={events} photoMatchMap={photoMatchMap} />
}
