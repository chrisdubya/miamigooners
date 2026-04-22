import type {PhotosData} from '../types/photos'

const MANIFEST_URL =
  'https://storage.googleapis.com/miami-gooners-photos/manifest.json'

function emptyPhotosData(): PhotosData {
  return {
    matches: [],
    stats: {
      totalFiles: 0,
      totalMatches: 0,
      contributors: 0,
      lastSync: new Date().toISOString(),
    },
    sharedFolderLink: '',
  }
}

export async function getMatchPhotos(): Promise<PhotosData> {
  try {
    const res = await fetch(MANIFEST_URL, {next: {revalidate: 300}})
    if (!res.ok) throw new Error(`Manifest fetch failed: ${res.status}`)
    return res.json()
  } catch (error) {
    console.error('Error fetching photo manifest:', error)
    return emptyPhotosData()
  }
}
