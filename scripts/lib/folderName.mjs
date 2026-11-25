/**
 * Normalizes Google Drive match-folder names into the canonical
 * "Opponent · YYYY-MM-DD" format the photo sync expects.
 *
 * Pure functions only — no Drive/GCS access — so this can be unit tested
 * (see folderName.test.mjs) and reused by other scripts.
 */

export const SEPARATOR = ' · '
export const CANONICAL_RE = /^(\S.*?) · (\d{4}-\d{2}-\d{2})$/

/** Build the canonical folder name. */
export function canonicalFolderName(opponent, date) {
  return `${opponent}${SEPARATOR}${date}`
}

/** True when a name already matches the expected format exactly. */
export function isCanonicalFolderName(name) {
  return CANONICAL_RE.test(name)
}

// ── Opponent normalization ──

/**
 * Nicknames / long forms → the names used in src/constants/teamColors.ts and
 * the fixturedownload.com feeds. Keys are normalized via normalizeKey().
 */
export const TEAM_ALIASES = {
  // Premier League
  'tottenham': 'Spurs',
  'tottenham hotspur': 'Spurs',
  'spurs': 'Spurs',
  'manchester city': 'Man City',
  'man city': 'Man City',
  'manchester united': 'Man Utd',
  'man united': 'Man Utd',
  'man utd': 'Man Utd',
  'nottingham forest': 'Nottingham Forest',
  'nottm forest': 'Nottingham Forest',
  'forest': 'Nottingham Forest',
  'wolverhampton': 'Wolves',
  'wolverhampton wanderers': 'Wolves',
  'newcastle united': 'Newcastle',
  'brighton and hove albion': 'Brighton',
  'brighton hove albion': 'Brighton',
  'west ham united': 'West Ham',
  'leeds united': 'Leeds',
  'villa': 'Aston Villa',
  'leicester city': 'Leicester',
  'ipswich town': 'Ipswich',
  'luton town': 'Luton',
  'sheffield united': 'Sheffield Utd',
  'palace': 'Crystal Palace',
  'bournemouth': 'Bournemouth',
  // Cups
  'wigan': 'Wigan Athletic',
  'coventry city': 'Coventry',
  'hull city': 'Hull',
  'pompey': 'Portsmouth',
  'mansfield': 'Mansfield Town',
  // Europe
  'bayern': 'Bayern Munich',
  'bayern munchen': 'Bayern Munich',
  'bayern munich': 'Bayern Munich',
  'atleti': 'Atletico Madrid',
  'atletico': 'Atletico Madrid',
  'atletico de madrid': 'Atletico Madrid',
  'real madrid': 'Real Madrid',
  'paris saint germain': 'PSG',
  'paris sg': 'PSG',
  'psv eindhoven': 'PSV',
  'rc lens': 'Lens',
  'as monaco': 'Monaco',
  'dortmund': 'Borussia Dortmund',
  'bvb': 'Borussia Dortmund',
  'bayer leverkusen': 'Leverkusen',
  'athletic bilbao': 'Athletic Club',
  'bilbao': 'Athletic Club',
  'barca': 'Barcelona',
  'betis': 'Real Betis',
  'kairat': 'Kairat Almaty',
  'como 1907': 'Como',
}

/** Words that carry no information about the opponent. */
const NOISE_TOKENS = new Set([
  'arsenal', 'gunners', 'afc',
  'vs', 'v', 'versus', 'at', '@',
  'match', 'matchday', 'game', 'photos', 'photo', 'pics', 'pictures',
  'watch', 'party', 'home', 'away', 'h', 'a', 'the',
  'ucl', 'cl', 'pl', 'epl', 'fa', 'cup', 'carabao', 'efl', 'league',
  'premier', 'champions', 'friendly', 'preseason', 'pre-season',
])

/** Lowercase, strip accents and punctuation, drop FC/CF, collapse spaces. */
export function normalizeKey(name) {
  return name
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[.'’`]/g, '')
    .replace(/[-_]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/^(?:fc|afc|cf) /, '')
    .replace(/ (?:fc|cf)$/, '')
}

/**
 * Map a cleaned opponent string onto a known team name.
 * Returns {opponent, known}. Unknown teams are passed through unchanged.
 */
export function canonicalOpponent(raw, knownTeams = []) {
  const key = normalizeKey(raw)
  if (!key) return {opponent: '', known: false}

  if (TEAM_ALIASES[key]) return {opponent: TEAM_ALIASES[key], known: true}

  const known = knownTeams.find((t) => normalizeKey(t) === key)
  if (known) return {opponent: known, known: true}

  return {opponent: raw.replace(/\s+/g, ' ').trim(), known: false}
}

// ── Date extraction ──

const MONTHS = {
  jan: 1, january: 1,
  feb: 2, february: 2,
  mar: 3, march: 3,
  apr: 4, april: 4,
  may: 5,
  jun: 6, june: 6,
  jul: 7, july: 7,
  aug: 8, august: 8,
  sep: 9, sept: 9, september: 9,
  oct: 10, october: 10,
  nov: 11, november: 11,
  dec: 12, december: 12,
}
const MONTH_RE = Object.keys(MONTHS).sort((a, b) => b.length - a.length).join('|')

const pad = (n) => String(n).padStart(2, '0')

function isoDate(y, m, d) {
  if (m < 1 || m > 12 || d < 1 || d > 31) return null
  const dt = new Date(Date.UTC(y, m - 1, d))
  if (dt.getUTCFullYear() !== y || dt.getUTCMonth() !== m - 1 || dt.getUTCDate() !== d) return null
  return `${y}-${pad(m)}-${pad(d)}`
}

function fullYear(y) {
  if (y === undefined || y === null || y === '') return null
  const n = Number(y)
  return n < 100 ? 2000 + n : n
}

/**
 * Find a date in a folder name.
 * Returns {span, candidates: [{m, d, y|null}]} or null when no date is present.
 * Several candidates are returned when the text is ambiguous (e.g. 3/4/26).
 */
export function extractDate(name) {
  let m

  // 2026-03-15 / 2026.03.15 / 2026/3/15
  m = name.match(/(?<!\d)(\d{4})[-/._](\d{1,2})[-/._](\d{1,2})(?!\d)/)
  if (m) {
    return {span: m[0], candidates: [{y: Number(m[1]), m: Number(m[2]), d: Number(m[3])}]}
  }

  // 15 March 2026 / 15th Mar 26 / 15 Mar
  m = name.match(new RegExp(`(?<!\\d)(\\d{1,2})(?:st|nd|rd|th)?[\\s.,_-]*(${MONTH_RE})\\b[\\s.,_-]*(\\d{4}|\\d{2})?(?!\\d)`, 'i'))
  if (m) {
    return {span: m[0], candidates: [{y: fullYear(m[3]), m: MONTHS[m[2].toLowerCase()], d: Number(m[1])}]}
  }

  // March 15, 2026 / Mar 15th 26 / Mar 15
  m = name.match(new RegExp(`\\b(${MONTH_RE})\\b[\\s.,_-]*(\\d{1,2})(?:st|nd|rd|th)?(?!\\d)(?:[\\s.,_-]*(\\d{4}|\\d{2})(?!\\d))?`, 'i'))
  if (m) {
    return {span: m[0], candidates: [{y: fullYear(m[3]), m: MONTHS[m[1].toLowerCase()], d: Number(m[2])}]}
  }

  // 3/15/2026 / 15.03.2026 / 3-15-26 / 3/15 (slash only when no year, to avoid scores like 3-1)
  m = name.match(/(?<!\d)(\d{1,2})([/.-])(\d{1,2})(?:\2(\d{4}|\d{2}))?(?!\d)/)
  if (m && (m[4] !== undefined || m[2] === '/')) {
    const a = Number(m[1])
    const b = Number(m[3])
    const y = fullYear(m[4])
    const candidates = []
    if (a <= 12 && b <= 31) candidates.push({y, m: a, d: b}) // US m/d
    if (b <= 12 && a <= 31 && a !== b) candidates.push({y, m: b, d: a}) // d/m
    if (candidates.length) return {span: m[0], candidates}
  }

  return null
}

// ── EXIF fallback ──

/**
 * Pick the day most photos were taken on. Accepts EXIF strings
 * ("2026:03:15 19:30:00") or ISO strings. Returns a yyyy-mm-dd or null when
 * fewer than `minShare` of the dated photos agree.
 */
export function dominantExifDate(times, {minShare = 0.6, minCount = 2} = {}) {
  const counts = new Map()
  let total = 0
  for (const t of times ?? []) {
    if (!t) continue
    const m = String(t).match(/^(\d{4})[:-](\d{2})[:-](\d{2})/)
    if (!m) continue
    const day = `${m[1]}-${m[2]}-${m[3]}`
    counts.set(day, (counts.get(day) ?? 0) + 1)
    total++
  }
  if (total < minCount) return null
  const [day, count] = [...counts.entries()].sort((a, b) => b[1] - a[1])[0]
  return count / total >= minShare ? day : null
}

// ── Main entry point ──

const DAY_MS = 86_400_000

function daysBetween(a, b) {
  return Math.abs(Date.parse(`${a}T00:00:00Z`) - Date.parse(`${b}T00:00:00Z`)) / DAY_MS
}

/**
 * Work out the canonical name for a Drive folder.
 *
 * @param {string} name            Current folder name
 * @param {object} [opts]
 * @param {string[]} [opts.knownTeams]   Team names from teamColors.ts
 * @param {{opponent:string,date:string}[]} [opts.fixtures]
 *                                 Known fixtures (date = UTC yyyy-mm-dd). Used to
 *                                 resolve ambiguous or incomplete dates.
 * @param {string} [opts.createdTime]    Folder createdTime (ISO) — reference for
 *                                 inferring a missing year
 * @param {string[]} [opts.exifTimes]    Photo capture times, used when the name
 *                                 has no date at all
 * @returns {{ok:true, name:string, opponent:string, date:string, changed:boolean,
 *            known:boolean, source:string, warnings:string[]}
 *          | {ok:false, reason:string, warnings:string[]}}
 */
export function normalizeFolderName(name, opts = {}) {
  const {knownTeams = [], fixtures = [], createdTime, exifTimes = []} = opts
  const warnings = []

  // Fast path: already canonical
  const exact = name.match(CANONICAL_RE)
  if (exact) {
    const {opponent, known} = canonicalOpponent(exact[1], knownTeams)
    const date = exact[2]
    const canonical = canonicalFolderName(opponent, date)
    if (!known) warnings.push(`unknown team "${opponent}" (not in teamColors.ts)`)
    return {
      ok: true, name: canonical, opponent, date,
      changed: canonical !== name, known, source: 'name', warnings,
    }
  }

  // 1. Pull the date out of the name
  const extracted = extractDate(name)
  let remainder = extracted ? name.replace(extracted.span, ' ') : name

  // 2. What is left is the opponent, once noise is removed
  remainder = remainder
    .replace(/\((?:h|a|home|away)\)/gi, ' ')
    .replace(/[()[\]{}]/g, ' ')
  const tokens = remainder
    .split(/[\s·•|,_/:;]+/)
    .map((t) => t.replace(/^[-–—.]+|[-–—.]+$/g, ''))
    .filter((t) => t && !NOISE_TOKENS.has(t.toLowerCase()))
    .filter((t) => !/^\d+(?:[-–:]\d+)?$/.test(t)) // stray numbers / scores like 3-1
  const {opponent, known} = canonicalOpponent(tokens.join(' '), knownTeams)
  if (!opponent) {
    return {ok: false, reason: 'could not determine the opponent', warnings}
  }
  if (!known) warnings.push(`unknown team "${opponent}" (not in teamColors.ts)`)

  const oppKey = normalizeKey(opponent)
  const oppFixtureDates = fixtures
    .filter((f) => normalizeKey(f.opponent) === oppKey)
    .map((f) => f.date)

  // 3. Resolve the date
  let date = null
  let source = 'name'

  if (extracted) {
    const ref = createdTime ? Date.parse(createdTime) : Date.now()
    const refYear = new Date(ref).getUTCFullYear()
    const candidates = []
    for (const c of extracted.candidates) {
      if (c.y !== null) {
        const iso = isoDate(c.y, c.m, c.d)
        if (iso) candidates.push({iso, inferredYear: false})
      } else {
        // No year in the name: try the fixture years, then the two most recent years
        const years = new Set([refYear, refYear - 1, ...oppFixtureDates.map((d) => Number(d.slice(0, 4)))])
        for (const y of years) {
          const iso = isoDate(y, c.m, c.d)
          if (iso) candidates.push({iso, inferredYear: true})
        }
      }
    }
    if (!candidates.length) {
      return {ok: false, reason: `"${extracted.span}" is not a valid date`, warnings}
    }

    const fixtureHits = candidates.filter((c) => oppFixtureDates.includes(c.iso))
    const unique = (arr) => [...new Set(arr.map((c) => c.iso))]

    if (unique(fixtureHits).length === 1) {
      date = fixtureHits[0].iso
      source = 'fixture'
    } else if (unique(candidates).length === 1) {
      date = candidates[0].iso
      if (candidates[0].inferredYear) warnings.push('year inferred — not in folder name')
    } else if (candidates.every((c) => c.inferredYear)) {
      // Same day/month, different years: take the most recent one that is not
      // well after the folder was created
      const past = candidates
        .map((c) => c.iso)
        .filter((iso) => Date.parse(`${iso}T00:00:00Z`) <= ref + 7 * DAY_MS)
        .sort()
      if (past.length) {
        date = past[past.length - 1]
        warnings.push('year inferred from folder creation time')
      }
    }

    if (!date) {
      return {
        ok: false,
        reason: `ambiguous date "${extracted.span}" (could be ${unique(candidates).join(' or ')})`,
        warnings,
      }
    }
    if (oppFixtureDates.length && !oppFixtureDates.includes(date)) {
      warnings.push(`no ${opponent} fixture on ${date}`)
    }
  } else {
    // No date in the name — fall back to when the photos were taken
    const exifDay = dominantExifDate(exifTimes)
    if (!exifDay) {
      return {ok: false, reason: 'no date in folder name and photo dates are unavailable or inconsistent', warnings}
    }
    // Folder dates follow the UTC kick-off day, so prefer a fixture within a day
    const near = oppFixtureDates
      .filter((d) => daysBetween(d, exifDay) <= 1)
      .sort((a, b) => daysBetween(a, exifDay) - daysBetween(b, exifDay))
    if (near.length) {
      date = near[0]
      source = 'fixture'
    } else {
      date = exifDay
      source = 'exif'
      warnings.push('date taken from photo EXIF data — no matching fixture found')
    }
  }

  const canonical = canonicalFolderName(opponent, date)
  return {ok: true, name: canonical, opponent, date, changed: canonical !== name, known, source, warnings}
}
