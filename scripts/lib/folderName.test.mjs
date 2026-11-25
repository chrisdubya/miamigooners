import {test} from 'node:test'
import assert from 'node:assert/strict'
import {
  normalizeFolderName,
  isCanonicalFolderName,
  extractDate,
  dominantExifDate,
  canonicalOpponent,
} from './folderName.mjs'

const knownTeams = [
  'Chelsea', 'Spurs', 'Man City', 'Man Utd', 'Nottingham Forest', 'Wolves',
  'Newcastle', 'Brighton', 'West Ham', 'PSG', 'Bayern Munich', 'Atletico Madrid',
  'Athletic Club', 'Wigan Athletic', 'Crystal Palace', 'Aston Villa',
]
const fixtures = [
  {opponent: 'Chelsea', date: '2026-02-03'},
  {opponent: 'Chelsea', date: '2025-11-30'},
  {opponent: 'Spurs', date: '2026-03-04'},
  {opponent: 'Spurs', date: '2025-11-23'},
  {opponent: 'Man City', date: '2026-04-03'},
  {opponent: 'Bayern München', date: '2025-11-26'},
  {opponent: 'Atleti', date: '2025-10-21'},
]
const opts = {knownTeams, fixtures, createdTime: '2026-03-20T12:00:00Z'}

const ok = (name, extra = {}) => {
  const r = normalizeFolderName(name, {...opts, ...extra})
  assert.equal(r.ok, true, `${name}: ${r.reason}`)
  return r
}

test('canonical names are recognised and left alone', () => {
  assert.equal(isCanonicalFolderName('Chelsea · 2026-02-03'), true)
  assert.equal(isCanonicalFolderName('Chelsea - 2026-02-03'), false)
  assert.equal(isCanonicalFolderName('Chelsea · 2026-02-03 '), false)
  const r = ok('Chelsea · 2026-02-03')
  assert.equal(r.changed, false)
  assert.equal(r.name, 'Chelsea · 2026-02-03')
})

test('canonical shape but wrong team casing is corrected', () => {
  const r = ok('chelsea · 2026-02-03')
  assert.equal(r.changed, true)
  assert.equal(r.name, 'Chelsea · 2026-02-03')
})

test('wrong separators are fixed', () => {
  for (const name of [
    'Chelsea - 2026-02-03',
    'Chelsea – 2026-02-03',
    'Chelsea 2026-02-03',
    'Chelsea_2026-02-03',
    'Chelsea | 2026-02-03',
    'Chelsea ·  2026-02-03',
    ' Chelsea · 2026-02-03 ',
    '2026-02-03 Chelsea',
    '2026-02-03 - Chelsea',
    'Chelsea (2026.02.03)',
    'Chelsea 2026/2/3',
  ]) {
    const r = ok(name)
    assert.equal(r.name, 'Chelsea · 2026-02-03', name)
    assert.equal(r.changed, true, name)
  }
})

test('noise words and Arsenal are stripped', () => {
  for (const name of [
    'Arsenal vs Chelsea 2026-02-03',
    'Chelsea vs Arsenal 2026-02-03',
    'Arsenal v Chelsea (A) 2026-02-03',
    'Chelsea (H) - 2026-02-03',
    'Chelsea away 2026-02-03',
    'Chelsea FA Cup 2026-02-03',
    'Chelsea matchday photos 2026-02-03',
    'Arsenal @ Chelsea - 2026-02-03',
    'Chelsea FC 2026-02-03',
  ]) {
    assert.equal(ok(name).name, 'Chelsea · 2026-02-03', name)
  }
})

test('team nicknames and long forms map to canonical names', () => {
  assert.equal(ok('Tottenham Hotspur 2026-03-04').name, 'Spurs · 2026-03-04')
  assert.equal(ok('Tottenham 2026-03-04').name, 'Spurs · 2026-03-04')
  assert.equal(ok('Manchester City 2026-04-03').name, 'Man City · 2026-04-03')
  assert.equal(ok("Nott'm Forest 2026-01-10").name, 'Nottingham Forest · 2026-01-10')
  assert.equal(ok('Wolverhampton Wanderers 2026-01-10').name, 'Wolves · 2026-01-10')
  assert.equal(ok('Bayern München 2025-11-26').name, 'Bayern Munich · 2025-11-26')
  assert.equal(ok('Atleti 2025-10-21').name, 'Atletico Madrid · 2025-10-21')
  assert.equal(ok('Paris Saint-Germain 2026-04-28').name, 'PSG · 2026-04-28')
  assert.equal(ok('Wigan 2026-02-14').name, 'Wigan Athletic · 2026-02-14')
  assert.equal(ok('Villa 2026-02-14').name, 'Aston Villa · 2026-02-14')
})

test('unknown teams are kept but flagged', () => {
  const r = ok('Olympiacos 2025-10-01')
  assert.equal(r.name, 'Olympiacos · 2025-10-01')
  assert.equal(r.known, false)
  assert.match(r.warnings.join(), /unknown team/)
})

test('US numeric dates', () => {
  assert.equal(ok('Chelsea 2/3/2026').name, 'Chelsea · 2026-02-03')
  assert.equal(ok('Chelsea 2/3/26').name, 'Chelsea · 2026-02-03')
  assert.equal(ok('Chelsea 11-30-2025').name, 'Chelsea · 2025-11-30')
  assert.equal(ok('Spurs 3-4-26').name, 'Spurs · 2026-03-04')
})

test('European numeric dates with a day over 12 are unambiguous', () => {
  assert.equal(ok('Chelsea 30.11.2025').name, 'Chelsea · 2025-11-30')
  assert.equal(ok('Chelsea 30/11/2025').name, 'Chelsea · 2025-11-30')
})

test('ambiguous numeric dates are resolved by fixtures', () => {
  // 3/2 could be 3 Feb or 2 Mar — only 3 Feb is a Chelsea fixture
  assert.equal(ok('Chelsea 3/2/2026').name, 'Chelsea · 2026-02-03')
  assert.equal(ok('Chelsea 03.02.2026').name, 'Chelsea · 2026-02-03')
  // 4/3 could be 4 Mar or 3 Apr — Spurs played 4 Mar, Man City 3 Apr
  assert.equal(ok('Spurs 4/3/2026').name, 'Spurs · 2026-03-04')
  assert.equal(ok('Man City 4/3/2026').name, 'Man City · 2026-04-03')
})

test('ambiguous numeric dates without a fixture are refused', () => {
  const r = normalizeFolderName('Olympiacos 3/2/2026', opts)
  assert.equal(r.ok, false)
  assert.match(r.reason, /ambiguous/)
  assert.match(r.reason, /2026-03-02/)
  assert.match(r.reason, /2026-02-03/)
})

test('textual dates', () => {
  assert.equal(ok('Chelsea 3 February 2026').name, 'Chelsea · 2026-02-03')
  assert.equal(ok('Chelsea 3rd Feb 2026').name, 'Chelsea · 2026-02-03')
  assert.equal(ok('Chelsea - Feb 3, 2026').name, 'Chelsea · 2026-02-03')
  assert.equal(ok('Chelsea (February 3rd 2026)').name, 'Chelsea · 2026-02-03')
  assert.equal(ok('Chelsea Feb 3 26').name, 'Chelsea · 2026-02-03')
  assert.equal(ok('Nov 30 2025 Chelsea').name, 'Chelsea · 2025-11-30')
})

test('missing year is taken from fixtures when possible', () => {
  assert.equal(ok('Chelsea 3 Feb').name, 'Chelsea · 2026-02-03')
  assert.equal(ok('Chelsea Nov 30').name, 'Chelsea · 2025-11-30')
  assert.equal(ok('Chelsea 11/30').name, 'Chelsea · 2025-11-30')
})

test('missing year with no fixture falls back to folder creation time', () => {
  // Folder created 2026-03-20: 10 Jan → 2026, 1 Dec → 2025
  const a = ok('Olympiacos 10 Jan')
  assert.equal(a.name, 'Olympiacos · 2026-01-10')
  assert.match(a.warnings.join(), /year inferred/)
  assert.equal(ok('Olympiacos Dec 1').name, 'Olympiacos · 2025-12-01')
})

test('scores are not mistaken for dates', () => {
  const r = ok('Chelsea 3-1 2026-02-03')
  assert.equal(r.name, 'Chelsea · 2026-02-03')
  // "3-1" alone with no year and no slash is not a date
  assert.equal(extractDate('Chelsea 3-1'), null)
})

test('invalid dates are refused', () => {
  const r = normalizeFolderName('Chelsea 2026-02-30', opts)
  assert.equal(r.ok, false)
  assert.match(r.reason, /not a valid date/)
})

test('unmatched date against known fixtures is renamed but warned', () => {
  const r = ok('Chelsea 2026-03-01')
  assert.equal(r.name, 'Chelsea · 2026-03-01')
  assert.match(r.warnings.join(), /no Chelsea fixture on 2026-03-01/)
})

test('no opponent is refused', () => {
  const r = normalizeFolderName('Arsenal 2026-02-03', opts)
  assert.equal(r.ok, false)
  assert.match(r.reason, /opponent/)
  assert.equal(normalizeFolderName('Misc photos', opts).ok, false)
})

test('no date in name: photo EXIF dates pick the day, fixture wins within a day', () => {
  const exifTimes = ['2026:02:02 20:15:00', '2026:02:02 21:00:00', '2026:02:02 22:30:00', '2026:02:03 00:10:00']
  const r = ok('Chelsea match', {exifTimes})
  assert.equal(r.name, 'Chelsea · 2026-02-03') // fixture date (UTC day) beats EXIF day
  assert.equal(r.source, 'fixture')
})

test('no date in name and no fixture: EXIF date used with a warning', () => {
  const r = ok('Olympiacos', {exifTimes: ['2025:10:01 20:00:00', '2025:10:01 21:00:00']})
  assert.equal(r.name, 'Olympiacos · 2025-10-01')
  assert.equal(r.source, 'exif')
  assert.match(r.warnings.join(), /EXIF/)
})

test('no date anywhere is refused', () => {
  const r = normalizeFolderName('Chelsea', opts)
  assert.equal(r.ok, false)
  assert.match(r.reason, /no date/)
  // scattered EXIF dates are not trusted either
  const r2 = normalizeFolderName('Chelsea', {...opts, exifTimes: ['2026:02:02 20:00:00', '2026:01:10 20:00:00', '2025:12:01 20:00:00']})
  assert.equal(r2.ok, false)
})

test('dominantExifDate thresholds', () => {
  assert.equal(dominantExifDate([]), null)
  assert.equal(dominantExifDate(['2026:02:02 20:00:00']), null) // below minCount
  assert.equal(dominantExifDate(['2026:02:02 20:00:00', '2026-02-02T21:00:00Z']), '2026-02-02')
  assert.equal(dominantExifDate(['2026:02:02 20:00:00', '2026:02:03 20:00:00']), null) // 50/50
})

test('canonicalOpponent ignores accents, punctuation and FC', () => {
  assert.equal(canonicalOpponent('Bayern Münchén', knownTeams).opponent, 'Bayern Munich')
  assert.equal(canonicalOpponent('Chelsea F.C.', knownTeams).opponent, 'Chelsea')
  assert.equal(canonicalOpponent('AFC Bournemouth', []).opponent, 'Bournemouth')
  assert.equal(canonicalOpponent('Brighton & Hove Albion', knownTeams).opponent, 'Brighton')
})
