import {google} from 'googleapis'
import {teamColors} from '../constants/teamColors'
import type {PhotosData, MatchFolder, DriveFile} from '../types/photos'

const FOLDER_ID = process.env.GOOGLE_DRIVE_FOLDER_ID ?? ''
const SERVICE_EMAIL = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL ?? ''
const PRIVATE_KEY_RAW = process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY ?? ''

function getDriveClient() {
  if (!FOLDER_ID || !SERVICE_EMAIL || !PRIVATE_KEY_RAW) {
    return null
  }

  const privateKey = PRIVATE_KEY_RAW.replace(/\\n/g, '\n')

  const auth = new google.auth.JWT({
    email: SERVICE_EMAIL,
    key: privateKey,
    scopes: ['https://www.googleapis.com/auth/drive.readonly'],
  })

  return google.drive({version: 'v3', auth})
}

const drive = getDriveClient()

// Aliases map folder opponent names → canonical team name in teamColors.ts
const teamAliases: Record<string, string> = {
  'wigan': 'Wigan Athletic',
  'nottingham forest': 'Nottingham Forest',
  'carabao cup final': 'Carabao Cup Final',
}

async function listSubFolders(parentId: string) {
  if (!drive) return []

  const res = await drive.files.list({
    q: `'${parentId}' in parents and mimeType = 'application/vnd.google-apps.folder' and trashed = false`,
    fields: 'files(id, name, createdTime)',
    orderBy: 'createdTime desc',
  })

  return res.data.files ?? []
}

async function listFilesInFolder(folderId: string): Promise<DriveFile[]> {
  if (!drive) return []

  const res = await drive.files.list({
    q: `'${folderId}' in parents and trashed = false and (mimeType contains 'image/' or mimeType contains 'video/')`,
    fields:
      'files(id,name,mimeType,description,createdTime,thumbnailLink,webViewLink,webContentLink,size,imageMediaMetadata(width,height),videoMediaMetadata(width,height,durationMillis),owners(displayName,emailAddress,photoLink))',
    orderBy: 'createdTime desc',
    pageSize: 100,
  })

  const files = res.data.files ?? []

  return files.map((f) => ({
    id: f.id ?? '',
    name: f.name ?? '',
    mimeType: f.mimeType ?? '',
    description: f.description ?? null,
    createdTime: f.createdTime ?? '',
    thumbnailLink: f.id
      ? `https://drive.google.com/thumbnail?id=${f.id}&sz=w600`
      : null,
    webViewLink: f.webViewLink ?? '',
    webContentLink: f.webContentLink ?? null,
    size: f.size ?? '0',
    imageMediaMetadata: f.imageMediaMetadata
      ? {
          width: f.imageMediaMetadata.width ?? 0,
          height: f.imageMediaMetadata.height ?? 0,
        }
      : undefined,
    videoMediaMetadata: f.videoMediaMetadata
      ? {
          width: f.videoMediaMetadata.width ?? 0,
          height: f.videoMediaMetadata.height ?? 0,
          durationMillis: String(f.videoMediaMetadata.durationMillis ?? '0'),
        }
      : undefined,
    owners: (f.owners ?? []).map((o) => ({
      displayName: o.displayName ?? '',
      emailAddress: o.emailAddress ?? '',
      photoLink: o.photoLink ?? undefined,
    })),
  }))
}

interface ParsedFolder {
  label: string
  opponent: string
  date: string
}

function parseFolderName(name: string): ParsedFolder | null {
  // Expected format: "Opponent · YYYY-MM-DD" (e.g. "Chelsea · 2026-03-01")
  const match = name.match(/^(.+?)\s*·\s*(\d{4}-\d{2}-\d{2})$/)
  if (!match) return null

  const [, rawOpponent, date] = match
  const opponent = rawOpponent.trim()
  // Resolve aliases (e.g. "Wigan" → "Wigan Athletic" to match teamColors)
  const canonical = teamAliases[opponent.toLowerCase()] ?? opponent

  return {label: `vs ${opponent}`, opponent: canonical, date}
}

function findTeamColor(teamName: string): string {
  const entry = teamColors.find(
    (tc) => tc.team.toLowerCase() === teamName.toLowerCase()
  )
  return entry?.primary ?? '#DB0007'
}

function emptyPhotosData(): PhotosData {
  return {
    matches: [],
    stats: {
      totalFiles: 0,
      totalMatches: 0,
      contributors: 0,
      lastSync: new Date().toISOString(),
    },
    sharedFolderLink: FOLDER_ID
      ? `https://drive.google.com/drive/folders/${FOLDER_ID}`
      : '',
  }
}

export async function getMatchPhotos(): Promise<PhotosData> {
  if (!drive) {
    console.warn(
      'Google Drive credentials not configured — returning empty photos data'
    )
    return emptyPhotosData()
  }

  try {
    const folders = await listSubFolders(FOLDER_ID)
    const contributorSet = new Set<string>()
    let totalFiles = 0

    const matches: MatchFolder[] = []

    for (const folder of folders) {
      if (!folder.id || !folder.name) continue

      const parsed = parseFolderName(folder.name)
      if (!parsed) {
        console.warn(
          `Skipping folder with unparseable name: "${folder.name}"`
        )
        continue
      }

      const files = await listFilesInFolder(folder.id)
      totalFiles += files.length

      // Collect unique contributors
      for (const file of files) {
        for (const owner of file.owners) {
          if (owner.displayName) {
            contributorSet.add(owner.displayName)
          }
        }
      }

      matches.push({
        id: folder.id,
        folderId: folder.id,
        label: parsed.label,
        opponent: parsed.opponent,
        competition: 'Premier League',
        date: parsed.date,
        teamColor: findTeamColor(parsed.opponent),
        result: '',
        files,
      })
    }

    return {
      matches,
      stats: {
        totalFiles,
        totalMatches: matches.length,
        contributors: contributorSet.size,
        lastSync: new Date().toISOString(),
      },
      sharedFolderLink: `https://drive.google.com/drive/folders/${FOLDER_ID}`,
    }
  } catch (error) {
    console.error('Error fetching match photos from Google Drive:', error)
    return emptyPhotosData()
  }
}
