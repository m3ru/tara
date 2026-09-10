export const TAU = Math.PI * 2
export const DEG = Math.PI / 180
export const NAKSHATRA_ARC = 360 / 27
export const PADA_ARC = 360 / 108
export const SIDEREAL_MONTH = 27.32166
export const SOLAR_YEAR = 365.25636
export const TROPICAL_YEAR = 365.2422
export const SYNODIC_MONTH = 1 / (1 / SIDEREAL_MONTH - 1 / SOLAR_YEAR)
export const mod = (angle: number, base = 360) => ((angle % base) + base) % base
export const longitude = (x: number, y: number) => mod(Math.atan2(y, x) / DEG)
export const separation = (sun: number, moon: number) => mod(moon - sun)
export function sectorIndex(angle: number, count: number) {
  // Suppress floating-point noise at exact rational sector boundaries.
  return Math.floor((mod(angle) * count) / 360 + 1e-10) % count
}
export function dms(angle: number) {
  const minutes = Math.round(mod(angle) * 60) % 21600
  return `${Math.floor(minutes / 60)}°${String(minutes % 60).padStart(2, '0')}′`
}
export const degrees = (angle: number) => `${mod(angle).toFixed(1)}°`
export const tithiNames = [
  'Pratipadā',
  'Dvitīyā',
  'Tṛtīyā',
  'Caturthī',
  'Pañcamī',
  'Ṣaṣṭhī',
  'Saptamī',
  'Aṣṭamī',
  'Navamī',
  'Daśamī',
  'Ekādaśī',
  'Dvādaśī',
  'Trayodaśī',
  'Caturdaśī',
]
export function tithiAt(sun: number, moon: number) {
  const angle = separation(sun, moon)
  const index = sectorIndex(angle, 30)
  const number = (index % 15) + 1
  return {
    angle,
    index,
    number,
    name: number === 15 ? (index < 15 ? 'Pūrṇimā' : 'Amāvāsyā') : tithiNames[number - 1],
    paksha: index < 15 ? 'Śukla' : 'Kṛṣṇa',
    waxing: index < 15,
    progress: Math.max(0, Math.min(1, (angle - index * 12) / 12)),
    illumination: (1 - Math.cos(angle * DEG)) / 2,
  }
}
export function phaseName(angle: number) {
  const a = mod(angle)
  if (a < 0.05 || a > 359.95) return 'New Moon'
  if (Math.abs(a - 90) < 0.05) return 'First quarter'
  if (Math.abs(a - 180) < 0.05) return 'Full Moon'
  if (Math.abs(a - 270) < 0.05) return 'Last quarter'
  return a < 90
    ? 'Waxing crescent'
    : a < 180
      ? 'Waxing gibbous'
      : a < 270
        ? 'Waning gibbous'
        : 'Waning crescent'
}
export const rulers = [
  'Ketu',
  'Venus',
  'Sun',
  'Moon',
  'Mars',
  'Rāhu',
  'Jupiter',
  'Saturn',
  'Mercury',
]
export const rulerYears = [7, 20, 6, 10, 7, 18, 16, 19, 17]
export const nakshatras = [
  ['Aśvinī', 'β and γ Arietis', 'Aśvins'],
  ['Bharaṇī', '35, 39 and 41 Arietis', 'Yama'],
  ['Kṛttikā', 'Pleiades', 'Agni'],
  ['Rohiṇī', 'Aldebaran', 'Prajāpati'],
  ['Mṛgaśīrṣa', 'Orion’s head', 'Soma'],
  ['Ārdrā', 'Betelgeuse', 'Rudra'],
  ['Punarvasu', 'Castor and Pollux', 'Aditi'],
  ['Puṣya', 'Stars in Cancer', 'Bṛhaspati'],
  ['Āśleṣā', 'Head of Hydra', 'Serpents'],
  ['Maghā', 'Regulus', 'Ancestors'],
  ['Pūrvaphalgunī', 'δ and θ Leonis', 'Bhaga'],
  ['Uttaraphalgunī', 'Denebola region', 'Aryaman'],
  ['Hasta', 'Stars in Corvus', 'Savitṛ'],
  ['Citrā', 'Spica', 'Tvaṣṭṛ'],
  ['Svāti', 'Arcturus', 'Vāyu'],
  ['Viśākhā', 'α and β Librae', 'Indra and Agni'],
  ['Anurādhā', 'δ, β and π Scorpii', 'Mitra'],
  ['Jyeṣṭhā', 'Antares', 'Indra'],
  ['Mūla', 'Scorpius’s tail', 'Nirṛti'],
  ['Pūrvāṣāḍhā', 'δ and ε Sagittarii', 'Waters'],
  ['Uttarāṣāḍhā', 'ζ and σ Sagittarii', 'All the gods'],
  ['Śravaṇa', 'Altair and nearby stars', 'Viṣṇu'],
  ['Dhaniṣṭhā', 'Stars in Delphinus', 'Vasus'],
  ['Śatabhiṣaj', 'λ Aquarii region', 'Varuṇa'],
  ['Pūrvabhādrapadā', 'α and β Pegasi', 'Aja Ekapād'],
  ['Uttarabhādrapadā', 'γ Pegasi and α Andromedae', 'Ahirbudhnya'],
  ['Revatī', 'ζ Piscium', 'Pūṣan'],
].map(([name, star, deity], index) => ({ name, star, deity, index, ruler: rulers[index % 9] }))
export const rashis = [
  'Meṣa',
  'Vṛṣabha',
  'Mithuna',
  'Karkaṭa',
  'Siṃha',
  'Kanyā',
  'Tulā',
  'Vṛścika',
  'Dhanus',
  'Makara',
  'Kumbha',
  'Mīna',
]
export const westernSigns = [
  'Aries',
  'Taurus',
  'Gemini',
  'Cancer',
  'Leo',
  'Virgo',
  'Libra',
  'Scorpio',
  'Sagittarius',
  'Capricorn',
  'Aquarius',
  'Pisces',
]
export const signSymbols = ['♈', '♉', '♊', '♋', '♌', '♍', '♎', '♏', '♐', '♑', '♒', '♓']
export function stellarPosition(moon: number) {
  const index = sectorIndex(moon, 27)
  const pada = (sectorIndex(moon, 108) % 4) + 1
  const progress = Math.max(0, Math.min(1, (mod(moon) - index * NAKSHATRA_ARC) / NAKSHATRA_ARC))
  return {
    ...nakshatras[index],
    pada,
    progress,
    rashi: sectorIndex(moon, 12),
    remainingYears: (1 - progress) * rulerYears[index % 9],
  }
}
export function karanaAt(sun: number, moon: number) {
  const half = sectorIndex(separation(sun, moon), 60)
  const sequence = ['Bava', 'Bālava', 'Kaulava', 'Taitila', 'Gara', 'Vaṇij', 'Viṣṭi']
  return {
    half,
    name:
      half === 0
        ? 'Kiṃstughna'
        : half === 57
          ? 'Śakuni'
          : half === 58
            ? 'Catuṣpāda'
            : half === 59
              ? 'Nāga'
              : sequence[(half - 1) % 7],
  }
}
export const yogaNames = [
  'Viṣkambha',
  'Prīti',
  'Āyuṣmat',
  'Saubhāgya',
  'Śobhana',
  'Atigaṇḍa',
  'Sukarman',
  'Dhṛti',
  'Śūla',
  'Gaṇḍa',
  'Vṛddhi',
  'Dhruva',
  'Vyāghāta',
  'Harṣaṇa',
  'Vajra',
  'Siddhi',
  'Vyatīpāta',
  'Varīyas',
  'Parigha',
  'Śiva',
  'Siddha',
  'Sādhya',
  'Śubha',
  'Śukla',
  'Brahman',
  'Indra',
  'Vaidhṛti',
]
export function meanPositions(day: number) {
  return { sun: mod((day * 360) / SOLAR_YEAR), moon: mod((day * 360) / SIDEREAL_MONTH) }
}
export function lunarLatitude(moon: number, node: number, inclination = 5.145) {
  // Exact relation for a great circle inclined to the ecliptic, parameterized by longitude.
  return Math.atan(Math.tan(inclination * DEG) * Math.sin((moon - node) * DEG)) / DEG
}
export function angularDistance(a: number, b: number) {
  return Math.abs(mod(a - b + 180) - 180)
}
export function skySeparation(sun: number, moon: number, moonLatitude = 0) {
  // Sun latitude is zero in this ecliptic model. The smaller 3D sky angle is unsigned.
  const cosine = Math.cos(moonLatitude * DEG) * Math.cos((moon - sun) * DEG)
  return Math.acos(Math.max(-1, Math.min(1, cosine))) / DEG
}
