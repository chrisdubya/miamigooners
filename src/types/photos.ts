export interface DriveOwner {
  displayName: string
  emailAddress: string
  photoLink?: string
}

export interface DriveFile {
  id: string
  name: string
  mimeType: string
  description: string | null
  createdTime: string
  thumbnailLink: string | null
  webViewLink: string
  webContentLink: string | null
  size: string
  imageMediaMetadata?: {width: number; height: number}
  videoMediaMetadata?: {width: number; height: number; durationMillis: string}
  owners: DriveOwner[]
}

export interface MatchFolder {
  id: string
  folderId: string
  label: string
  opponent: string
  competition: string
  date: string
  teamColor: string
  result: string
  files: DriveFile[]
}

export interface PhotosData {
  matches: MatchFolder[]
  stats: {
    totalFiles: number
    totalMatches: number
    contributors: number
    lastSync: string
  }
  sharedFolderLink: string
}

export interface PhotoItem extends DriveFile {
  matchId: string
  matchLabel: string
  matchDate: string
  teamColor: string
  competition: string
  aspect: number
}
