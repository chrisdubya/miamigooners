#!/usr/bin/env node
/**
 * One-time script to fix Drive folder names with incorrect dates.
 */

import {google} from 'googleapis'
import fs from 'fs'
import path from 'path'

const envPath = path.resolve(process.cwd(), '.env.local')
const envContent = fs.readFileSync(envPath, 'utf-8')
function getEnv(key) {
  const match = envContent.match(new RegExp(`^${key}=["']?(.*?)["']?$`, 'm'))
  return match ? match[1] : ''
}

const SERVICE_EMAIL = getEnv('GOOGLE_SERVICE_ACCOUNT_EMAIL')
const PRIVATE_KEY_RAW = getEnv('GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY')
const privateKey = PRIVATE_KEY_RAW.replace(/\\n/g, '\n')

const auth = new google.auth.JWT({
  email: SERVICE_EMAIL,
  key: privateKey,
  scopes: ['https://www.googleapis.com/auth/drive'],
})
const drive = google.drive({version: 'v3', auth})

const RENAMES = [
  {id: '1zUDOqB9YNX16pU6dG4U8Jqvqrh44vyVY', from: 'Southampton · 2025-04-04', to: 'Southampton · 2026-04-04'},
  {id: '1EghxigTugZwf2944yo3wpIM75dBBc4sV', from: 'Chelsea · 2026-03-01', to: 'Chelsea · 2026-02-03'},
  {id: '1UaA7Fd7DTSMmVSmq3RZk9d_FyxlPOqvr', from: 'Wigan · 2026-02-15', to: 'Wigan · 2026-02-14'},
]

async function main() {
  for (const {id, from, to} of RENAMES) {
    await drive.files.update({fileId: id, requestBody: {name: to}})
    console.log(`✓ Renamed: "${from}" → "${to}"`)
  }
  console.log('\nDone!')
}

main().catch((err) => {
  console.error('Fatal error:', err)
  process.exit(1)
})
