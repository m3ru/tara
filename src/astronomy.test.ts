import { test } from 'node:test'
import assert from 'node:assert/strict'
import {
  mod,
  separation,
  tithiAt,
  stellarPosition,
  NAKSHATRA_ARC,
  PADA_ARC,
  dms,
  rulerYears,
  meanPositions,
  SIDEREAL_MONTH,
  SYNODIC_MONTH,
  lunarLatitude,
  sectorIndex,
  karanaAt,
  longitude,
  skySeparation,
} from './astronomy'

const close = (actual: number, expected: number, epsilon = 1e-8) =>
  assert.ok(Math.abs(actual - expected) < epsilon, `${actual} ≈ ${expected}`)

test('longitude wraps across zero while preserving eastward sense', () => {
  assert.equal(mod(-10), 350)
  assert.equal(mod(360), 0)
  assert.equal(separation(350, 10), 20)
  assert.equal(separation(10, 350), 340)
  assert.equal(separation(0, 270), 270)
  assert.equal(longitude(0, 1), 90)
  assert.equal(longitude(-1, 0), 180)
})
test('all 30 tithi boundaries belong to the interval that begins there', () => {
  for (let i = 0; i < 30; i++) {
    assert.equal(tithiAt(0, i * 12).index, i)
    assert.equal(tithiAt(32, mod(32 + i * 12)).index, i)
    assert.equal(tithiAt(0, mod(i * 12 - 0.00001)).index, mod(i - 1, 30))
  }
  assert.equal(tithiAt(0, 179.999).name, 'Pūrṇimā')
  assert.equal(tithiAt(0, 180).name, 'Pratipadā')
  assert.equal(tithiAt(0, 180).paksha, 'Kṛṣṇa')
  assert.equal(tithiAt(0, 359.999).name, 'Amāvāsyā')
  assert.equal(tithiAt(0, 360).paksha, 'Śukla')
})
test('changing the common zero cannot change tithi', () => {
  for (let s = 0; s < 360; s += 13.7)
    for (let m = 0; m < 360; m += 27.1)
      for (const offset of [0, 24, 27.3, 180]) {
        close(separation(mod(s + offset), mod(m + offset)), separation(s, m))
        assert.equal(tithiAt(mod(s + offset), mod(m + offset)).index, tithiAt(s, m).index)
      }
})
test('illumination distinguishes phase sense but agrees at both quarters', () => {
  close(tithiAt(0, 0).illumination, 0)
  close(tithiAt(0, 90).illumination, 0.5)
  close(tithiAt(0, 180).illumination, 1)
  close(tithiAt(0, 270).illumination, 0.5)
  assert.equal(tithiAt(0, 90).waxing, true)
  assert.equal(tithiAt(0, 270).waxing, false)
})
test('actual sky separation includes latitude and differs from a directed longitude lead', () => {
  close(skySeparation(0, 0, 5), 5)
  close(separation(0, 0), 0)
  close(skySeparation(0, 270, 0), 90)
  close(skySeparation(0, 180, 5), 175)
})
test('27 stations and 108 padas divide a full circle at exact boundaries', () => {
  for (let i = 0; i < 27; i++) assert.equal(stellarPosition(i * NAKSHATRA_ARC).index, i)
  for (let i = 0; i < 108; i++) {
    assert.equal(stellarPosition(i * PADA_ARC).pada, (i % 4) + 1)
    assert.equal(stellarPosition(i * PADA_ARC).index, Math.floor(i / 4))
  }
  assert.equal(stellarPosition(360).index, 0)
  assert.equal(stellarPosition(40).name, 'Rohiṇī')
  assert.equal(stellarPosition(30).rashi, 1)
  assert.equal(dms(NAKSHATRA_ARC), '13°20′')
  assert.equal(dms(PADA_ARC), '3°20′')
})
test('dasha proportional balance and cycle length', () => {
  assert.equal(
    rulerYears.reduce((a, b) => a + b, 0),
    120,
  )
  close(stellarPosition(NAKSHATRA_ARC * 0.75).remainingYears, 7 * 0.25)
  close(stellarPosition(NAKSHATRA_ARC * 1.75).remainingYears, 20 * 0.25)
})
test('mean motions separate stellar return from phase return', () => {
  const sid = meanPositions(SIDEREAL_MONTH)
  close(sid.moon, 0)
  assert.ok(sid.sun > 26 && sid.sun < 28)
  const syn = meanPositions(SYNODIC_MONTH)
  assert.ok(Math.min(separation(syn.sun, syn.moon), 360 - separation(syn.sun, syn.moon)) < 1e-8)
  assert.ok(SYNODIC_MONTH > 29.53 && SYNODIC_MONTH < 29.54)
})
test('lunar nodes cross northward and southward with correct amplitude', () => {
  for (const node of [0, 32, 270]) {
    close(lunarLatitude(node, node), 0)
    close(lunarLatitude(node + 180, node), 0)
    close(lunarLatitude(node + 90, node), 5.145)
    close(lunarLatitude(node + 270, node), -5.145)
    assert.ok(lunarLatitude(node + 1, node) > 0)
    assert.ok(lunarLatitude(node + 181, node) < 0)
  }
})
test('karaṇa follows its repeating and fixed endpoint sequence', () => {
  assert.equal(karanaAt(0, 0).name, 'Kiṃstughna')
  assert.equal(karanaAt(0, 6).name, 'Bava')
  assert.equal(karanaAt(0, 42).name, 'Viṣṭi')
  assert.equal(karanaAt(0, 48).name, 'Bava')
  assert.equal(karanaAt(0, 342).name, 'Śakuni')
  assert.equal(karanaAt(0, 348).name, 'Catuṣpāda')
  assert.equal(karanaAt(0, 354).name, 'Nāga')
  assert.equal(sectorIndex(720, 27), 0)
})
