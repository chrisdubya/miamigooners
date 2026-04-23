#!/usr/bin/env node
/**
 * Syncs thumbnails + metadata from Google Drive to Google Cloud Storage.
 *
 * For each image/video file:
 *   - Uploads {fileId}_w600.jpg  (grid thumbnails)
 *   - Uploads {fileId}_w1600.jpg (lightbox full-size)
 *
 * After all thumbnails are synced, generates and uploads a manifest.json
 * containing the full PhotosData structure the app consumes.
 *
 * Usage:
 *   node scripts/sync-thumbnails.mjs
 *
 * Requires:
 *   - .env.local with GOOGLE_DRIVE_FOLDER_ID, GOOGLE_SERVICE_ACCOUNT_EMAIL,
 *     GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY
 */

import {google} from 'googleapis'
import {Storage} from '@google-cloud/storage'
import fs from 'fs'
import path from 'path'

const BUCKET_NAME = 'miami-gooners-photos'
const GCS_BASE = `https://storage.googleapis.com/${BUCKET_NAME}/thumbnails`
const THUMBNAIL_SIZES = [600, 1600]
const CONCURRENCY = 3 // parallel uploads to avoid Drive rate limits

// ── Load .env.local ──
const envPath = path.resolve(process.cwd(), '.env.local')
const envContent = fs.readFileSync(envPath, 'utf-8')
function getEnv(key) {
  const match = envContent.match(new RegExp(`^${key}=["']?(.*?)["']?$`, 'm'))
  return match ? match[1] : ''
}

const FOLDER_ID = getEnv('GOOGLE_DRIVE_FOLDER_ID')
const SERVICE_EMAIL = getEnv('GOOGLE_SERVICE_ACCOUNT_EMAIL')
const PRIVATE_KEY_RAW = getEnv('GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY')

if (!FOLDER_ID || !SERVICE_EMAIL || !PRIVATE_KEY_RAW) {
  console.error('Missing Google Drive env vars in .env.local')
  process.exit(1)
}

const privateKey = PRIVATE_KEY_RAW.replace(/\\n/g, '\n')

// ── Drive client ──
const driveAuth = new google.auth.JWT({
  email: SERVICE_EMAIL,
  key: privateKey,
  scopes: ['https://www.googleapis.com/auth/drive.readonly'],
})
const drive = google.drive({version: 'v3', auth: driveAuth})

// ── GCS client (uses same service account credentials from .env.local) ──
const storage = new Storage({
  credentials: {
    client_email: SERVICE_EMAIL,
    private_key: privateKey,
  },
})
const bucket = storage.bucket(BUCKET_NAME)

// ── Team colors (parsed from src/constants/teamColors.ts at runtime) ──
const teamColorsPath = path.resolve(process.cwd(), 'src/constants/teamColors.ts')
const teamColorsSrc = fs.readFileSync(teamColorsPath, 'utf-8')
const teamColors = [...teamColorsSrc.matchAll(/primary:\s*(['"])(.+?)\1\s*,\s*\n\s*secondary:\s*(['"]).+?\3\s*,\s*\n\s*team:\s*(['"])(.+?)\4/g)]
  .map(([, , primary, , , team]) => ({primary, team}))

// ── Folder parsing (mirrors src/utils/googleDrive.ts) ──
const teamAliases = {
  'wigan': 'Wigan Athletic',
  'nottingham forest': 'Nottingham Forest',
}

function parseFolderName(name) {
  const match = name.match(/^(.+?)\s*·\s*(\d{4}-\d{2}-\d{2})$/)
  if (!match) return null
  const [, rawOpponent, date] = match
  const opponent = rawOpponent.trim()
  const canonical = teamAliases[opponent.toLowerCase()] ?? opponent
  return {label: `vs ${opponent}`, opponent: canonical, date}
}

function findTeamColor(teamName) {
  const entry = teamColors.find(
    (tc) => tc.team.toLowerCase() === teamName.toLowerCase()
  )
  return entry?.primary ?? '#DB0007'
}

// ── Drive helpers ──
async function listSubFolders(parentId) {
  const res = await drive.files.list({
    q: `'${parentId}' in parents and mimeType = 'application/vnd.google-apps.folder' and trashed = false`,
    fields: 'files(id, name, createdTime)',
    orderBy: 'createdTime desc',
    pageSize: 100,
  })
  return res.data.files || []
}

async function listFilesInFolder(folderId) {
  const allFiles = []
  let pageToken = undefined

  do {
    const res = await drive.files.list({
      q: `'${folderId}' in parents and trashed = false and (mimeType contains 'image/' or mimeType contains 'video/')`,
      fields:
        'nextPageToken, files(id,name,mimeType,description,createdTime,webViewLink,webContentLink,size,imageMediaMetadata(width,height),videoMediaMetadata(width,height,durationMillis),owners(displayName,emailAddress,photoLink))',
      orderBy: 'createdTime desc',
      pageSize: 100,
      pageToken,
    })
    allFiles.push(...(res.data.files || []))
    pageToken = res.data.nextPageToken
  } while (pageToken)

  return allFiles
}

function mapDriveFile(f) {
  return {
    id: f.id ?? '',
    name: f.name ?? '',
    mimeType: f.mimeType ?? '',
    description: f.description ?? null,
    createdTime: f.createdTime ?? '',
    thumbnailLink: f.id ? `${GCS_BASE}/${f.id}_w600.jpg` : null,
    webViewLink: f.webViewLink ?? '',
    webContentLink: f.webContentLink ?? null,
    size: f.size ?? '0',
    imageMediaMetadata: f.imageMediaMetadata
      ? {width: f.imageMediaMetadata.width ?? 0, height: f.imageMediaMetadata.height ?? 0}
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
  }
}

// ── Thumbnail helpers ──
async function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms))
}

async function downloadThumbnail(fileId, width) {
  const url = `https://drive.google.com/thumbnail?id=${fileId}&sz=w${width}`
  const res = await fetch(url)
  if (!res.ok) {
    throw new Error(`Failed to fetch thumbnail ${fileId} w${width}: ${res.status}`)
  }
  return Buffer.from(await res.arrayBuffer())
}

async function uploadToGCS(fileId, width, buffer) {
  const destination = `thumbnails/${fileId}_w${width}.jpg`
  const file = bucket.file(destination)
  await file.save(buffer, {
    metadata: {
      contentType: 'image/jpeg',
      cacheControl: 'public, max-age=604800', // 7 day cache
    },
  })
  return `https://storage.googleapis.com/${BUCKET_NAME}/${destination}`
}

async function fileExistsInGCS(fileId, width) {
  const destination = `thumbnails/${fileId}_w${width}.jpg`
  const [exists] = await bucket.file(destination).exists()
  return exists
}

// ── Main ──
async function main() {
  console.log('Listing match folders...')
  const folders = await listSubFolders(FOLDER_ID)
  console.log(`Found ${folders.length} folders\n`)

  let totalFiles = 0
  let uploaded = 0
  let skipped = 0
  let failed = 0
  const contributorSet = new Set()
  const matches = []

  for (const folder of folders) {
    if (!folder.id || !folder.name) continue

    // Skip non-match folders
    if (folder.name === 'Other') {
      console.log(`⊘ Skipping "${folder.name}"`)
      continue
    }

    const parsed = parseFolderName(folder.name)
    if (!parsed) {
      console.warn(`⊘ Skipping folder with unparseable name: "${folder.name}"`)
      continue
    }

    const rawFiles = await listFilesInFolder(folder.id)
    if (rawFiles.length === 0) continue

    console.log(`\n📁 ${folder.name} — ${rawFiles.length} files`)
    totalFiles += rawFiles.length

    // Map Drive files to app format
    const files = rawFiles.map(mapDriveFile)

    // Collect contributors
    for (const file of files) {
      for (const owner of file.owners) {
        if (owner.displayName) contributorSet.add(owner.displayName)
      }
    }

    // Build match folder object
    matches.push({
      id: folder.id,
      folderId: folder.id,
      label: parsed.label,
      opponent: parsed.opponent,
      competition: 'Premier League',
      date: parsed.date,
      teamColor: findTeamColor(parsed.opponent),
      result: '',
      score: null,
      isHome: null,
      coverThumbnail: files.length > 0 && files[0].id
        ? `${GCS_BASE}/${files[0].id}_w600.jpg`
        : null,
      files,
    })

    // Sync thumbnails in batches
    for (let i = 0; i < rawFiles.length; i += CONCURRENCY) {
      const batch = rawFiles.slice(i, i + CONCURRENCY)

      await Promise.all(
        batch.map(async (file) => {
          if (!file.id) return

          for (const width of THUMBNAIL_SIZES) {
            try {
              const exists = await fileExistsInGCS(file.id, width)
              if (exists) {
                skipped++
                continue
              }

              const buffer = await downloadThumbnail(file.id, width)
              await uploadToGCS(file.id, width, buffer)
              uploaded++
              process.stdout.write('.')
            } catch (err) {
              failed++
              console.error(`\n✗ ${file.name} w${width}: ${err.message}`)
            }
          }
        })
      )

      if (i + CONCURRENCY < rawFiles.length) {
        await sleep(500)
      }
    }
  }

  // Sort matches by date descending (most recent first)
  matches.sort((a, b) => b.date.localeCompare(a.date))

  // Build and upload manifest
  const manifest = {
    matches,
    stats: {
      totalFiles,
      totalMatches: matches.length,
      contributors: contributorSet.size,
      lastSync: new Date().toISOString(),
    },
    sharedFolderLink: `https://drive.google.com/drive/folders/${FOLDER_ID}`,
  }

  console.log('\n\nUploading manifest.json...')
  const manifestFile = bucket.file('manifest.json')
  await manifestFile.save(JSON.stringify(manifest, null, 2), {
    metadata: {
      contentType: 'application/json',
      cacheControl: 'public, max-age=60',
    },
  })

  console.log(`\n✓ Done!`)
  console.log(`  Total files:  ${totalFiles}`)
  console.log(`  Matches:      ${matches.length}`)
  console.log(`  Uploaded:     ${uploaded}`)
  console.log(`  Skipped:      ${skipped} (already existed)`)
  console.log(`  Failed:       ${failed}`)
  console.log(`  Contributors: ${contributorSet.size}`)
  console.log(`\n  Manifest: https://storage.googleapis.com/${BUCKET_NAME}/manifest.json`)
  console.log(`  Bucket:   https://storage.googleapis.com/${BUCKET_NAME}/thumbnails/`)
}

main().catch((err) => {
  console.error('Fatal error:', err)
  process.exit(1)
})
