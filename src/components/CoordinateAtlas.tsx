import { useState } from 'react'
import { DEG, degrees, longitude } from '../astronomy'
import { Segmented, Slider, SourceLink } from './Controls'

export default function CoordinateAtlas() {
  const [origin, setOrigin] = useState('earth')
  const [angle, setAngle] = useState(115)
  const earth = { x: 1, y: 0 },
    planet = { x: 1.6 * Math.cos(angle * DEG), y: 1.6 * Math.sin(angle * DEG) }
  const observer = origin === 'earth' ? earth : { x: 0, y: 0 }
  const geo = longitude(planet.x - earth.x, planet.y - earth.y)
  const value = origin === 'earth' ? geo : angle
  const project = (p: { x: number; y: number }) => ({ x: 260 + p.x * 110, y: 222 - p.y * 110 })
  const s = project({ x: 0, y: 0 }),
    e = project(earth),
    p = project(planet),
    o = project(observer)
  const end = { x: o.x + 55 * Math.cos(value * DEG), y: o.y - 55 * Math.sin(value * DEG) }
  return (
    <section className="atlas section-card" id="coordinate-atlas">
      <div className="section-heading">
        <div>
          <h2>Geocentric and heliocentric longitude</h2>
        </div>
      </div>
      <p>
        A longitude needs an origin, a plane, and a zero. Keep the plane and zero fixed here, then
        move the origin from Earth to the Sun.
      </p>
      <div className="atlas-layout">
        <div>
          <Segmented
            label="Coordinate origin"
            value={origin}
            options={[
              { value: 'earth', label: 'Earth-centered' },
              { value: 'sun', label: 'Sun-centered' },
            ]}
            onChange={setOrigin}
          />
          <svg
            viewBox="0 0 540 450"
            className="atlas-diagram"
            role="img"
            aria-label={`${origin === 'earth' ? 'Geocentric' : 'Heliocentric'} longitude of a model planet is ${degrees(value)}`}
          >
            <circle cx={s.x} cy={s.y} r="110" fill="none" stroke="#d4d7c9" strokeDasharray="4 5" />
            <circle cx={s.x} cy={s.y} r="176" fill="none" stroke="#d4d7c9" />
            <line
              x1={o.x}
              y1={o.y}
              x2={o.x + 130}
              y2={o.y}
              stroke="#a6ac9b"
              strokeDasharray="3 4"
            />
            <text x={o.x + 125} y={o.y + 20} textAnchor="end" className="diagram-note small">
              same zero direction
            </text>
            <line x1={o.x} y1={o.y} x2={p.x} y2={p.y} stroke="#587f9c" strokeWidth="2" />
            <path
              d={`M${o.x + 55},${o.y} A55,55 0 ${value > 180 ? 1 : 0} 0 ${end.x},${end.y}`}
              stroke="#587f9c"
              strokeWidth="1.5"
              fill="none"
            />
            <circle cx={o.x} cy={o.y} r="24" fill="none" stroke="#31594f" strokeDasharray="2 3" />
            <circle cx={s.x} cy={s.y} r="11" fill="#d9a84c" />
            <text x={s.x} y={s.y + 38} textAnchor="middle" className="body-label sun-label">
              Sun
            </text>
            <circle cx={e.x} cy={e.y} r="8" fill="#31594f" />
            <text x={e.x} y={e.y - 33} textAnchor="middle" className="body-label">
              Earth
            </text>
            <circle cx={p.x} cy={p.y} r="8" fill="#a37964" />
            <text x={p.x} y={p.y - 20} textAnchor="middle" className="body-label">
              Model planet
            </text>
          </svg>
        </div>
        <div className="atlas-explanation">
          <div className="atlas-number">
            <span>{origin === 'earth' ? 'Geocentric' : 'Heliocentric'} longitude</span>
            <strong>{degrees(value)}</strong>
            <p>The angle is measured at the {origin === 'earth' ? 'Earth' : 'Sun'}.</p>
          </div>
          <Slider
            label="Planet’s position around the Sun"
            value={angle}
            onChange={setAngle}
            color="blue"
          />
          <div className="comparison-values">
            <div>
              <span>From Earth</span>
              <b>{degrees(geo)}</b>
            </div>
            <div>
              <span>From Sun</span>
              <b>{degrees(angle)}</b>
            </div>
          </div>
          <p className="small-copy">
            The body stays in the same place when you switch origins. Its direction changes because
            you are looking from a different point.
          </p>
        </div>
      </div>
      <div className="table-scroll">
        <table className="coordinate-table">
          <caption>Other coordinates you will encounter</caption>
          <thead>
            <tr>
              <th>System</th>
              <th>Measured from</th>
              <th>Reference</th>
              <th>What it answers</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Ecliptic λ, β</td>
              <td>Earth or Sun</td>
              <td>Ecliptic plane; specified zero</td>
              <td>Where around the orbital plane?</td>
            </tr>
            <tr>
              <td>Right ascension, declination</td>
              <td>Usually Earth’s center</td>
              <td>Celestial equator; equinox for traditional RA</td>
              <td>Where on an equatorial star map?</td>
            </tr>
            <tr>
              <td>Azimuth, altitude</td>
              <td>Your location on Earth</td>
              <td>Your horizon; usually north for azimuth</td>
              <td>Where do I point a telescope now?</td>
            </tr>
            <tr>
              <td>Geographic longitude, latitude</td>
              <td>Earth’s terrestrial frame</td>
              <td>Prime meridian; Earth’s equator</td>
              <td>Where am I on Earth’s surface?</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p className="small-copy">
        Topocentric means centered on your observing location. For nearby bodies, its sightline
        differs from the geocentric one: parallax. The local horizon also changes as Earth rotates.
      </p>
      <SourceLink href="https://aa.usno.navy.mil/faq/asa_glossary">
        Coordinate definitions · US Naval Observatory
      </SourceLink>
    </section>
  )
}
