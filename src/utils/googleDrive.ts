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

// Older manifests carried an emailAddress on every owner. This whole object is
// handed to a client component, so anything left on it ships to the browser —
// drop the field on read rather than waiting for the manifest to be re-synced.
function stripOwnerEmails(data: PhotosData): PhotosData {
  return {
    ...data,
    matches: data.matches.map((match) => ({
      ...match,
      files: match.files.map((file) => ({
        ...file,
        owners: (file.owners ?? []).map(({displayName, photoLink}) => ({
          displayName,
          photoLink,
        })),
      })),
    })),
  }
}

export async function getMatchPhotos(): Promise<PhotosData> {
  try {
    const res = await fetch(MANIFEST_URL, {next: {revalidate: 300}})
    if (!res.ok) throw new Error(`Manifest fetch failed: ${res.status}`)
    return stripOwnerEmails(await res.json())
  } catch (error) {
    console.error('Error fetching photo manifest:', error)
    return emptyPhotosData()
  }
}
