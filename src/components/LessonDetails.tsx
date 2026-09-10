import { useState } from 'react'
import { ArrowRight, Search, ArrowUpRight } from 'lucide-react'
import {
  DEG,
  dms,
  degrees,
  mod,
  tithiAt,
  stellarPosition,
  NAKSHATRA_ARC,
  PADA_ARC,
  nakshatras,
  rashis,
  westernSigns,
  rulers,
  rulerYears,
  SIDEREAL_MONTH,
  SYNODIC_MONTH,
  SOLAR_YEAR,
  TROPICAL_YEAR,
  lunarLatitude,
  karanaAt,
  sectorIndex,
  yogaNames,
} from '../astronomy'
import { historicalLayers, monthPairs, sources } from '../content'
import { Disclosure, Note, Slider, SourceLink } from './Controls'
import { MoonFace } from './SkyDiagram'
import CoordinateAtlas from './CoordinateAtlas'
import { stationPassages, type OpenPassage } from '../passages'
import { PassageLink } from './PassageReader'

export function Panchanga({ sun, moon }: { sun: number; moon: number }) {
  const t = tithiAt(sun, moon),
    n = stellarPosition(moon),
    k = karanaAt(sun, moon),
    y = sectorIndex(sun + moon, 27)
  return (
    <section className="section-card" id="panchanga">
      <div className="section-heading">
        <div>
          <h2>Pañcāṅga</h2>
        </div>
      </div>
      <div className="panchanga-grid">
        {[
          [
            '01',
            'Tithi',
            `${t.paksha} ${t.name}`,
            `${degrees(t.angle)} ÷ 12° → interval ${t.index + 1}`,
            'Moon − Sun, wrapped to 360°',
          ],
          [
            '02',
            'Vāra',
            'No civil date selected',
            'Weekday needs a date and local convention',
            'The seven-day week',
          ],
          [
            '03',
            'Nakṣatra',
            n.name,
            `${dms(moon)} → station ${n.index + 1}, pāda ${n.pada}`,
            'Moon’s sidereal longitude',
          ],
          [
            '04',
            'Yoga',
            yogaNames[y],
            `${degrees(sun + moon)} ÷ 13°20′ → interval ${y + 1}`,
            'Sun + Moon, using sidereal longitudes',
          ],
          [
            '05',
            'Karaṇa',
            k.name,
            `${degrees(t.angle)} ÷ 6° → half-tithi ${k.half + 1}`,
            'Half of a tithi',
          ],
        ].map(([i, name, value, formula, meaning]) => (
          <article key={i}>
            <span className="limb-name">{name}</span>
            <h3>{value}</h3>
            <p>{meaning}</p>
            <code>{formula}</code>
          </article>
        ))}
      </div>
      <p className="small-copy">
        These are angular calculations for the scene you set. A dated pañcāṅga also needs accurate
        ephemerides, sunrise times, location, and calendar conventions. Unlike the longitude
        difference, yoga’s longitude sum changes when the reference zero changes.
      </p>
      <SourceLink href={sources[2].url}>
        Modern pañcāṅga practice · India Meteorological Department
      </SourceLink>
    </section>
  )
}

function TithiDetails({
  sun,
  moon,
  onMoon,
}: {
  sun: number
  moon: number
  onMoon: (n: number) => void
}) {
  const t = tithiAt(sun, moon)
  const [civilShift, setCivilShift] = useState(4)
  return (
    <>
      <section className="section-card">
        <div className="section-heading">
          <div>
            <h2>The 30 tithis</h2>
          </div>
        </div>
        {[0, 1].map((half) => (
          <div className="tithi-half" key={half}>
            <div className="half-label">
              <span>{half === 0 ? 'ŚUKLA PAKṢA' : 'KṚṢṆA PAKṢA'}</span>
              <span>{half === 0 ? 'Waxing · 0–180°' : 'Waning · 180–360°'}</span>
            </div>
            <div className="tithi-cells">
              {Array.from({ length: 15 }, (_, i) => {
                const index = half * 15 + i
                return (
                  <button
                    className={t.index === index ? 'active' : ''}
                    key={i}
                    onClick={() => onMoon(mod(sun + index * 12 + 6))}
                    aria-label={`${half === 0 ? 'Waxing' : 'Waning'} tithi ${i + 1}, ${index * 12} to ${(index + 1) * 12} degrees`}
                    aria-pressed={t.index === index}
                  >
                    <MoonFace angle={index * 12 + 6} size={30} />
                    <span>{i + 1}</span>
                  </button>
                )
              })}
            </div>
          </div>
        ))}
        <div className="selected-tithi">
          <strong>
            {t.paksha} {t.name}
          </strong>
          <span>
            {t.index * 12}° ≤ eastward lead &lt; {(t.index + 1) * 12}°
          </span>
          <span>{(t.progress * 100).toFixed(0)}% through this tithi</span>
        </div>
        <Disclosure title="Why does full Moon mark the end of Pūrṇimā tithi?">
          Pūrṇimā is the waxing fifteenth interval, 168°–180°. The exact full-Moon instant is its
          endpoint. This tool assigns a boundary to the interval starting there, so exactly 180°
          displays Kṛṣṇa Pratipadā. Likewise, exactly 0° begins Śukla Pratipadā; Amāvāsyā is the
          interval immediately before it.
        </Disclosure>
      </section>
      <section className="section-card">
        <div className="section-heading">
          <div>
            <h2>Tithis at sunrise</h2>
          </div>
        </div>
        <p>
          The mean tithi is about 23 h 37 m, and individual durations vary. A civil date’s tithi is
          often identified at sunrise. Move the sunrise lines across these illustrative, unequal
          intervals.
        </p>
        <Slider
          label="Shift the sunrise sampling"
          value={civilShift}
          min={0}
          max={24}
          step={0.5}
          suffix=" h"
          onChange={setCivilShift}
        />
        <div className="civil-diagram">
          <svg
            viewBox="0 0 850 165"
            role="img"
            aria-label="Illustrative varying tithi lengths crossed by sunrise lines"
          >
            {[0, 22, 48, 68, 95, 119].slice(0, -1).map((start, i) => {
              const ends = [22, 48, 68, 95, 119]
              return (
                <g key={i}>
                  <rect
                    x={35 + start * 6.3}
                    y="50"
                    width={(ends[i] - start) * 6.3 - 2}
                    height="54"
                    fill={i % 2 ? '#e4e7db' : '#d6e0d4'}
                  />
                  <text
                    x={35 + ((start + ends[i]) / 2) * 6.3}
                    y="82"
                    textAnchor="middle"
                    fontSize="13"
                    fill="#31594f"
                  >
                    Tithi {i + 1}
                  </text>
                </g>
              )
            })}
            {Array.from({ length: 5 }, (_, i) => {
              const x = 35 + (i * 24 + civilShift) * 6.3
              return (
                <g key={i}>
                  <line x1={x} y1="28" x2={x} y2="122" stroke="#bd8b35" strokeWidth="1.5" />
                  <circle cx={x} cy="28" r="5" fill="#d9a84c" />
                  <text x={x} y="145" textAnchor="middle" fontSize="11" fill="#7b715a">
                    Sunrise {i + 1}
                  </text>
                </g>
              )
            })}
          </svg>
        </div>
        <Note title="Look for zero crossings or two crossings">
          If a tithi contains no sunrise, it gets no sunrise-based date label. If it contains two
          sunrises, its name can appear on two consecutive dates. It has still elapsed normally.
        </Note>
        <p className="small-copy">
          The example uses invented 20–27 hour intervals to expose the sampling effect. Festival
          observance can use additional rules and other times of day.
        </p>
      </section>
    </>
  )
}

function StellarDetails({
  moon,
  onMoon,
  onPassage,
}: {
  moon: number
  onMoon: (n: number) => void
  onPassage: OpenPassage
}) {
  const n = stellarPosition(moon)
  const [query, setQuery] = useState('')
  const normalize = (s: string) =>
    s
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
  const filtered = nakshatras.filter((n) =>
    normalize(`${n.name} ${n.star} ${n.deity}`).includes(normalize(query)),
  )
  return (
    <>
      <section className="section-card">
        <div className="section-heading">
          <div>
            <h2>
              {n.name} <span className="muted-serif">/ Pāda {n.pada}</span>
            </h2>
          </div>
          <span className="pill">
            {rashis[n.rashi]} · {westernSigns[n.rashi]}
          </span>
        </div>
        <div className="station-facts">
          <div>
            <span>Equal sector</span>
            <strong>
              {dms(n.index * NAKSHATRA_ARC)} –{' '}
              {n.index === 26 ? '360°00′' : dms((n.index + 1) * NAKSHATRA_ARC)}
            </strong>
          </div>
          <div>
            <span>Traditional stellar association</span>
            <strong>{n.star}</strong>
          </div>
          <div>
            <span>Divine association</span>
            <strong>{n.deity}</strong>
          </div>
        </div>
        <PassageLink ids={stationPassages(n.index)} onOpen={onPassage} />
        <div className="pada-strip">
          {[1, 2, 3, 4].map((p) => (
            <button
              key={p}
              className={n.pada === p ? 'active' : ''}
              onClick={() => onMoon(n.index * NAKSHATRA_ARC + (p - 0.5) * PADA_ARC)}
              aria-pressed={n.pada === p}
            >
              <span>PĀDA {p}</span>
              <b>{dms(n.index * NAKSHATRA_ARC + (p - 1) * PADA_ARC)}</b>
            </button>
          ))}
        </div>
        <p className="small-copy">
          Stars are landmarks, not evenly spaced boundary markers. Some identifying stars lie far
          from the ecliptic, and identifications vary by source. The wheel shows equal longitude
          sectors.
        </p>
        <Disclosure title="How the Moon’s position becomes a daśā balance">
          <p>
            In Viṃśottarī daśā, this nakṣatra belongs to the {n.ruler} period. The cycle below
            totals 120 prescribed years and repeats over the 27 stations.
          </p>
          <div className="dasha-sequence">
            {rulers.map((r, i) => (
              <div key={r} className={n.index % 9 === i ? 'active' : ''}>
                <b>{r}</b>
                <span>{rulerYears[i]} years</span>
              </div>
            ))}
          </div>
          <div className="dasha-equation">
            <b>{(100 - n.progress * 100).toFixed(1)}%</b>
            <span>of the station remains ×</span>
            <b>{rulerYears[n.index % 9]} years</b>
            <span>=</span>
            <b>{n.remainingYears.toFixed(2)} years</b>
          </div>
          <p>
            That is the proportional first-period balance if this were a natal Moon. Move it across
            the station and watch the balance shrink. Conversion into civil dates depends on the
            year-length convention.
          </p>
          <p className="small-copy">
            This illustrates a later astrological rule. Coherent arithmetic does not establish the
            validity of its life predictions. A janma nakṣatra is specifically the Moon’s station at
            birth; any body’s longitude can be assigned a nakṣatra.
          </p>
        </Disclosure>
      </section>
      <section className="section-card">
        <div className="section-heading">
          <div>
            <h2>The 27 nakṣatras</h2>
          </div>
          <label className="search-field">
            <Search size={16} />
            <input
              aria-label="Search lunar stations"
              placeholder="Name, star, or deity…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </label>
        </div>
        <div className="nakshatra-index">
          {filtered.map((item) => (
            <button
              key={item.name}
              className={item.index === n.index ? 'active' : ''}
              onClick={() => onMoon((item.index + 0.5) * NAKSHATRA_ARC)}
              aria-pressed={item.index === n.index}
            >
              <span className="index-number">{String(item.index + 1).padStart(2, '0')}</span>
              <span>
                <b>{item.name}</b>
                <small>{item.star}</small>
              </span>
              <ArrowUpRight size={15} />
            </button>
          ))}
        </div>
        {!filtered.length && (
          <p className="empty-state">No matching station. Try a star name, such as Spica.</p>
        )}
        <div className="source-row">
          <SourceLink href={sources[4].url}>Stars and arcs · Chakravarty</SourceLink>
          <SourceLink href="https://github.com/Stellarium/stellarium/tree/master/skycultures/indian_nakshatras">
            Stellar identifications · Stellarium sky culture
          </SourceLink>
        </div>
        <Disclosure title="Where did the 28th nakṣatra go?">
          Traditions with 28 stations include Abhijit, associated with Vega. The 27-equal-sector
          wheel shown here is a particular standardized system; it should not be projected unchanged
          onto every early list. Counting stations is a choice of grid, not a claim that the Moon’s
          orbit lasts exactly 27 days.
        </Disclosure>
      </section>
    </>
  )
}

function ClockDetails({ day }: { day: number }) {
  const eAngle = 180 + (day * 360) / SOLAR_YEAR
  const ex = 230 + 135 * Math.cos(eAngle * DEG),
    ey = 205 - 135 * Math.sin(eAngle * DEG)
  const mx = ex + 32 * Math.cos(((day * 360) / SIDEREAL_MONTH) * DEG),
    my = ey - 32 * Math.sin(((day * 360) / SIDEREAL_MONTH) * DEG)
  return (
    <>
      <section className="section-card">
        <div className="section-heading">
          <div>
            <h2>Why the Sun’s direction moves</h2>
          </div>
        </div>
        <div className="orbit-explanation">
          <svg
            viewBox="0 0 480 415"
            role="img"
            aria-label="Earth traveling around the Sun while Moon travels around Earth"
          >
            <circle cx="230" cy="205" r="135" fill="none" stroke="#ced2c2" />
            <circle cx={ex} cy={ey} r="32" fill="none" stroke="#bbcbd3" />
            <line x1="230" y1="205" x2={ex} y2={ey} stroke="#c8a465" strokeDasharray="4 4" />
            <line x1={ex} y1={ey} x2={mx} y2={my} stroke="#5e839c" />
            <circle cx="230" cy="205" r="15" fill="#dfb360" />
            <text x="230" y="243" textAnchor="middle" className="body-label sun-label">
              Sun
            </text>
            <circle cx={ex} cy={ey} r="9" fill="#31594f" />
            <circle cx={mx} cy={my} r="5" fill="#7194aa" />
            <text x={ex} y={ey + 53} textAnchor="middle" className="body-label">
              Earth + Moon
            </text>
          </svg>
          <div>
            <h3>Earth carries the Moon along.</h3>
            <p>
              This shows the same elapsed time as the main diagram, with the Sun at the center. As
              Earth moves, the direction from Earth to the Sun turns against the stars.
            </p>
            <div className="equation-block">
              1 / T<sub>syn</sub> = 1 / T<sub>sid</sub> − 1 / T<sub>year</sub>
            </div>
            <p className="small-copy">
              The year in this orbital relation is the sidereal year, about 365.256 days. For
              seasonal calendar drift below, the tropical year is about 365.242 days.
            </p>
            <SourceLink href={sources[1].url}>Mean lunar periods · NASA</SourceLink>
          </div>
        </div>
      </section>
      <section className="section-card">
        <div className="section-heading">
          <div>
            <h2>Lunar and solar years</h2>
          </div>
        </div>
        <p>
          Twelve phase cycles make about 354.37 days. The seasonal year is about 365.24 days. A
          calendar of twelve lunar months shifts about eleven days earlier through the seasons each
          year.
        </p>

        <div className="calendar-bars">
          <div>
            <span>Seasonal year</span>
            <div className="calendar-track">
              <div style={{ width: '100%' }} />
            </div>
            <b>365.24 d</b>
          </div>
          <div>
            <span>12 lunar months</span>
            <div className="calendar-track lunar">
              {Array.from({ length: 12 }, (_, i) => (
                <i key={i} style={{ width: `${(SYNODIC_MONTH / TROPICAL_YEAR) * 100}%` }} />
              ))}
            </div>
            <b>354.37 d</b>
          </div>
        </div>

        <Note title="Adhikamāsa keeps lunar months tied to the solar cycle">
          An extra lunar month is inserted from time to time. In a common amānta rule, a lunar month
          with no solar entry into a new sidereal sign is intercalary. The trigger depends on the
          Sun’s motion; it is not simply “add a month every third year.”
        </Note>
        <Disclosure title="Why month boundaries and festival dates can differ">
          Amānta months run from new Moon to new Moon; pūrṇimānta months run from full Moon to full
          Moon. Regional solar calendars and festival rules add other conventions. This model
          explains the arithmetic behind the mismatch; it does not determine an actual festival
          date.
        </Disclosure>
      </section>
    </>
  )
}

export function NodeSection({ sun, moon, node }: { sun: number; moon: number; node: number }) {
  const beta = lunarLatitude(moon, node),
    x = (a: number) => 50 + mod(a) * 1.8,
    y = (b: number) => 128 - b * 14
  const curve = Array.from(
    { length: 361 },
    (_, i) => `${i ? 'L' : 'M'}${50 + i * 1.8},${y(lunarLatitude(i, node))}`,
  ).join(' ')
  return (
    <section className="section-card">
      <div className="section-heading">
        <div>
          <h2>Lunar latitude</h2>
        </div>
        <span className="pill">Moon β {beta.toFixed(2)}°</span>
      </div>
      <svg
        className="node-strip"
        viewBox="0 0 750 270"
        role="img"
        aria-label={`Moon's latitude ${beta.toFixed(2)} degrees, ascending node at ${degrees(node)}`}
      >
        <rect x="50" y="45" width="648" height="83" fill="#e8ecdf" />
        <rect x="50" y="128" width="648" height="83" fill="#e6ebed" />
        {[0, 90, 180, 270, 360].map((a) => (
          <g key={a}>
            <line x1={50 + a * 1.8} y1="45" x2={50 + a * 1.8} y2="211" stroke="#d3d8ce" />
            <text x={50 + a * 1.8} y="239" textAnchor="middle" className="degree-label">
              {a}°
            </text>
          </g>
        ))}
        <text x="39" y="61" textAnchor="end" className="degree-label">
          +5°
        </text>
        <text x="39" y="132" textAnchor="end" className="degree-label">
          0°
        </text>
        <text x="39" y="202" textAnchor="end" className="degree-label">
          −5°
        </text>
        <line x1="50" y1="128" x2="698" y2="128" stroke="#85977c" strokeWidth="1.5" />
        <path d={curve} stroke="#64839c" strokeWidth="2" fill="none" />
        {[node, mod(node + 180)].map((a, i) => (
          <g key={i}>
            <circle cx={x(a)} cy="128" r="6" fill="#f6f4ec" stroke="#a57979" strokeWidth="2" />
            <text x={x(a)} y={i === 0 ? '106' : '158'} textAnchor="middle" className="node-label">
              {i === 0 ? 'Rāhu ↑' : 'Ketu ↓'}
            </text>
          </g>
        ))}
        <circle cx={x(sun)} cy="128" r="11" fill="#d9a84c" />
        <circle cx={x(moon)} cy={y(beta)} r="7" fill="#6388a4" stroke="#f6f4ec" strokeWidth="2" />
        <text x="374" y="265" textAnchor="middle" className="diagram-note small">
          Sidereal longitude → · vertical latitude scale expanded
        </text>
      </svg>
      <div className="two-notes">
        <div>
          <h3>Same longitude is only one condition.</h3>
          <p>
            The Sun lies on the ecliptic. Follow the blue lunar path to see whether the Moon is also
            near that plane when its longitude matches or opposes the Sun.
          </p>
        </div>
        <div>
          <h3>The nodes move too.</h3>
          <p>
            The lunar nodes regress around the ecliptic over about 18.6 years. Here you place them
            manually to isolate the geometry. This is an alignment model, not an eclipse prediction.
          </p>
        </div>
      </div>
      <SourceLink href={sources[1].url}>Lunar inclination and nodes · NASA</SourceLink>
    </section>
  )
}

function TraditionDetails({
  sun,
  moon,
  onScene,
}: {
  sun: number
  moon: number
  onScene: (s: number, m: number) => void
}) {
  const [month, setMonth] = useState<number | null>(null)
  return (
    <>
      <Panchanga sun={sun} moon={moon} />
      <section className="section-card" id="month-names">
        <div className="section-heading">
          <div>
            <h2>Lunar month names</h2>
          </div>
        </div>
        <p>
          Select a month to place an illustrative full Moon in an associated station. Month
          assignment in actual calendars depends on solar and lunar boundaries, including
          intercalation.
        </p>
        <div className="month-grid">
          {monthPairs.map(([name, station, index], i) => (
            <button
              className={month === i ? 'active' : ''}
              aria-pressed={month === i}
              key={name}
              onClick={() => {
                setMonth(i)
                const m = (index + 0.5) * NAKSHATRA_ARC
                onScene(mod(m - 180), m)
              }}
            >
              <b>{name}</b>
              <span>
                <ArrowRight size={13} />
                {station}
              </span>
            </button>
          ))}
        </div>
        <p className="small-copy">
          For paired stations the example uses the first named station. This shows the traditional
          naming association, not the longitude range of a calendar month.
        </p>
      </section>
      <section className="historical-context" id="historical-map">
        <Disclosure title="Historical context">
          <ol>
            {historicalLayers.map((h) => (
              <li key={h.title}>
                <h3>{h.title}</h3>
                <small>{h.era}</small>
                <p>{h.body}</p>
                <SourceLink href={sources[h.source].url}>Source</SourceLink>
              </li>
            ))}
          </ol>
        </Disclosure>
      </section>
    </>
  )
}

export default function LessonDetails({
  lesson,
  sun,
  moon,
  node,
  day,
  onMoon,
  onScene,
  onPassage,
}: {
  lesson: number
  sun: number
  moon: number
  node: number
  day: number
  onMoon: (n: number) => void
  onScene: (s: number, m: number) => void
  onPassage: OpenPassage
}) {
  if (lesson === 0) return <CoordinateAtlas />
  if (lesson === 1) return <TithiDetails sun={sun} moon={moon} onMoon={onMoon} />
  if (lesson === 2) return <StellarDetails moon={moon} onMoon={onMoon} onPassage={onPassage} />
  if (lesson === 3) return <ClockDetails day={day} />
  if (lesson === 4) return <NodeSection sun={sun} moon={moon} node={node} />
  return <TraditionDetails sun={sun} moon={moon} onScene={onScene} />
}
