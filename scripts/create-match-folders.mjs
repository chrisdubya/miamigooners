#!/usr/bin/env node
/**
 * Creates empty Google Drive folders for upcoming matches.
 * Folder naming convention: "Opponent · YYYY-MM-DD"
 *
 * Skips folders that already exist. Safe to run multiple times.
 *
 * Usage:
 *   node scripts/create-match-folders.mjs
 */

import {google} from 'googleapis'
import fs from 'fs'
import path from 'path'

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

const auth = new google.auth.JWT({
  email: SERVICE_EMAIL,
  key: privateKey,
  scopes: ['https://www.googleapis.com/auth/drive'],
})
const drive = google.drive({version: 'v3', auth})

// ── Folders to create ──
const MATCH_FOLDERS = [
  'Newcastle · 2026-04-25',
  'Atletico Madrid · 2026-04-29',
  'Fulham · 2026-05-02',
  'Atletico Madrid · 2026-05-05',
  'West Ham · 2026-05-10',
  'Burnley · 2026-05-17',
  'Crystal Palace · 2026-05-24',
]

async function main() {
  // List existing folders to avoid duplicates
  const res = await drive.files.list({
    q: `'${FOLDER_ID}' in parents and mimeType = 'application/vnd.google-apps.folder' and trashed = false`,
    fields: 'files(id, name)',
    pageSize: 200,
  })
  const existing = new Set((res.data.files || []).map((f) => f.name))

  console.log(`Found ${existing.size} existing folders\n`)

  let created = 0
  let skipped = 0

  for (const name of MATCH_FOLDERS) {
    if (existing.has(name)) {
      console.log(`⊘ Already exists: "${name}"`)
      skipped++
      continue
    }

    await drive.files.create({
      requestBody: {
        name,
        mimeType: 'application/vnd.google-apps.folder',
        parents: [FOLDER_ID],
      },
      fields: 'id, name',
    })
    console.log(`✓ Created: "${name}"`)
    created++
  }

  console.log(`\nDone! Created: ${created}, Skipped: ${skipped}`)
}

main().catch((err) => {
  console.error('Fatal error:', err)
  process.exit(1)
})
