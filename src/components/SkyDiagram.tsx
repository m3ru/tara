import { useRef, useState, type PointerEvent, type KeyboardEvent } from 'react'
import {
  DEG,
  degrees,
  mod,
  nakshatras,
  rashis,
  separation,
  sectorIndex,
  lunarLatitude,
} from '../astronomy'

const CX = 360,
  CY = 315
export function point(angle: number, radius: number, cy = CY, cx = CX) {
  return { x: cx + Math.cos(angle * DEG) * radius, y: cy - Math.sin(angle * DEG) * radius }
}
function arc(radius: number, start: number, sweep: number) {
  const a = point(start, radius)
  const b = point(start + Math.min(sweep, 359.999), radius)
  return `M ${a.x} ${a.y} A ${radius} ${radius} 0 ${sweep > 180 ? 1 : 0} 0 ${b.x} ${b.y}`
}
function wedge(inner: number, outer: number, start: number, sweep: number) {
  const a = point(start, outer),
    b = point(start + sweep, outer)
  const c = point(start + sweep, inner),
    d = point(start, inner)
  return `M${a.x},${a.y} A${outer},${outer} 0 ${sweep > 180 ? 1 : 0} 0 ${b.x},${b.y} L${c.x},${c.y} A${inner},${inner} 0 ${sweep > 180 ? 1 : 0} 1 ${d.x},${d.y} Z`
}

export function MoonFace({ angle, size = 64 }: { angle: number; size?: number }) {
  const a = mod(angle),
    waxing = a <= 180,
    c = Math.cos(a * DEG)
  const sign = waxing ? 1 : -1
  const points = []
  for (let i = 0; i <= 60; i++) {
    const t = -Math.PI / 2 + (i / 60) * Math.PI
    points.push(`${50 + sign * 43 * Math.cos(t)},${50 + 43 * Math.sin(t)}`)
  }
  for (let i = 60; i >= 0; i--) {
    const t = -Math.PI / 2 + (i / 60) * Math.PI
    points.push(`${50 + sign * c * 43 * Math.cos(t)},${50 + 43 * Math.sin(t)}`)
  }
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      role="img"
      aria-label={`Moon phase at ${a.toFixed(1)} degrees eastward lead`}
    >
      <circle cx="50" cy="50" r="44" fill="#293c44" />
      <polygon points={points.join(' ')} fill="#eee9d7" />
      <circle cx="50" cy="50" r="43" fill="none" stroke="#95a2a3" strokeWidth="0.5" />
    </svg>
  )
}

type Props = {
  sun: number
  moon: number
  offset: number
  lesson: number
  step: number
  tilted: boolean
  latitude: number
  grid: string
  padas: boolean
  node: number
  onSun: (angle: number) => void
  onMoon: (angle: number) => void
}
export default function SkyDiagram({
  sun,
  moon,
  offset,
  lesson,
  step,
  tilted,
  latitude,
  grid,
  padas,
  node,
  onSun,
  onMoon,
}: Props) {
  const ref = useRef<SVGSVGElement>(null)
  const [dragging, setDragging] = useState<'sun' | 'moon' | null>(null)
  const yScale = tilted ? 0.55 : 1
  const delta = separation(sun, moon)
  const zero = -offset
  const s = point(sun, 221),
    m = point(moon, 195)
  const beta = lesson === 4 ? lunarLatitude(moon, node) : latitude
  const moonLift = tilted ? 195 * Math.tan(beta * DEG) * Math.sqrt(1 - yScale ** 2) : 0
  const moonDisplay = { x: m.x, y: CY + (m.y - CY) * yScale - moonLift }
  const sunDisplay = { x: s.x, y: CY + (s.y - CY) * yScale }
  const showDifference = lesson !== 0 || step >= 3
  const stellar = lesson === 2
  const showNak = stellar && grid !== 'rashi'
  const showRashi = stellar && grid !== 'nakshatra'
  const outer = stellar ? 282 : 252
  function handleMove(e: PointerEvent<SVGSVGElement>) {
    if (!dragging || !ref.current) return
    const ctm = ref.current.getScreenCTM()
    if (!ctm) return
    const p = new DOMPoint(e.clientX, e.clientY).matrixTransform(ctm.inverse())
    const angle = mod(
      Math.atan2((CY - p.y - (dragging === 'moon' ? moonLift : 0)) / yScale, p.x - CX) / DEG,
    )
    if (Math.hypot(p.x - CX, (p.y - CY) / yScale) < 24) return
    ;(dragging === 'moon' ? onMoon : onSun)(Math.round(angle * 10) / 10)
  }
  function keyMove(e: KeyboardEvent<SVGGElement>, body: 'sun' | 'moon') {
    if (!['ArrowRight', 'ArrowLeft', 'ArrowUp', 'ArrowDown', 'Home', 'End'].includes(e.key)) return
    e.preventDefault()
    const current = body === 'moon' ? moon : sun
    const value =
      e.key === 'Home'
        ? -offset
        : e.key === 'End'
          ? 359.9 - offset
          : current + (['ArrowRight', 'ArrowUp'].includes(e.key) ? 1 : -1) * (e.shiftKey ? 10 : 1)
    ;(body === 'moon' ? onMoon : onSun)(mod(value))
  }
  function begin(e: PointerEvent<SVGGElement>, body: 'sun' | 'moon') {
    e.preventDefault()
    ref.current?.setPointerCapture(e.pointerId)
    setDragging(body)
  }
  const labelAnchor = (x: number) => (x < CX - 25 ? 'end' : 'start')
  return (
    <svg
      ref={ref}
      className={`sky-diagram ${dragging ? 'dragging' : ''}`}
      viewBox="0 0 720 620"
      aria-label={`Earth-centered sky. Sun longitude ${degrees(sun + offset)}, Moon longitude ${degrees(moon + offset)}, eastward lead ${degrees(delta)}.`}
      onPointerMove={handleMove}
      onPointerUp={() => setDragging(null)}
      onPointerCancel={() => setDragging(null)}
      onLostPointerCapture={() => setDragging(null)}
    >
      <defs>
        <radialGradient id="earth-fill">
          <stop stopColor="#79938b" />
          <stop offset="1" stopColor="#31594f" />
        </radialGradient>
        <radialGradient id="sun-halo">
          <stop stopColor="#d6a245" stopOpacity="0.25" />
          <stop offset="1" stopColor="#d6a245" stopOpacity="0" />
        </radialGradient>
        <marker
          id="green-arrow"
          viewBox="0 0 10 10"
          refX="8"
          refY="5"
          markerWidth="5"
          markerHeight="5"
          orient="auto-start-reverse"
        >
          <path d="M0 0L10 5L0 10Z" fill="#31594f" />
        </marker>
      </defs>

      <g transform={`translate(0 ${CY * (1 - yScale)}) scale(1 ${yScale})`}>
        <circle
          cx={CX}
          cy={CY}
          r={outer}
          fill="#ebece0"
          fillOpacity="0.28"
          stroke="#d3d5c8"
          strokeWidth="1"
        />
        <circle cx={CX} cy={CY} r="221" fill="none" stroke="#c7cdbf" strokeDasharray="2 6" />
        <circle cx={CX} cy={CY} r="195" fill="none" stroke="#d3d9d5" strokeDasharray="2 6" />
        {[0, 90, 180, 270].map((a) => {
          const p = point(a + zero, outer)
          return <line key={a} x1={CX} y1={CY} x2={p.x} y2={p.y} stroke="#dedfd4" strokeWidth="1" />
        })}
        {Array.from({ length: 72 }, (_, i) => {
          const a = point(i * 5 + zero, stellar ? 231 : 252),
            b = point(i * 5 + zero, stellar ? (i % 6 === 0 ? 222 : 227) : i % 6 === 0 ? 241 : 247)
          return (
            <line
              key={i}
              x1={a.x}
              y1={a.y}
              x2={b.x}
              y2={b.y}
              stroke={i % 6 === 0 ? '#8d978c' : '#b8beb0'}
            />
          )
        })}
        {lesson === 1 &&
          Array.from({ length: 30 }, (_, i) => {
            const selected = sectorIndex(delta, 30) === i
            const p = point(sun + i * 12 + 6, 238)
            return (
              <g
                key={i}
                className="clickable-sector"
                role="button"
                tabIndex={0}
                aria-label={`Tithi ${i + 1}: ${i * 12} to ${(i + 1) * 12} degrees`}
                onClick={() => onMoon(mod(sun + i * 12 + 6))}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    onMoon(mod(sun + i * 12 + 6))
                  }
                }}
              >
                <path
                  d={wedge(223, 252, sun + i * 12, 12)}
                  fill={selected ? '#31594f' : i < 15 ? '#e5eadc' : '#e2e6e9'}
                  stroke="#f6f4ec"
                  strokeWidth="1"
                />
                <text
                  x={p.x}
                  y={p.y + 4}
                  textAnchor="middle"
                  fontSize="10"
                  fill={selected ? '#fff' : '#626f68'}
                >
                  {(i % 15) + 1}
                </text>
              </g>
            )
          })}
        {showRashi &&
          rashis.map((name, i) => {
            const inner = 234,
              out = showNak ? 258 : 282,
              p = point(i * 30 + 15, (inner + out) / 2)
            return (
              <g
                key={name}
                role="button"
                tabIndex={0}
                className="clickable-sector"
                aria-label={`${name} sign, ${i * 30} to ${(i + 1) * 30} degrees`}
                onClick={() => onMoon(i * 30 + 15)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    onMoon(i * 30 + 15)
                  }
                }}
              >
                <path
                  d={wedge(inner, out, i * 30, 30)}
                  fill={sectorIndex(moon, 12) === i ? '#dfbd7f' : '#ece7d8'}
                  stroke="#f6f4ec"
                  strokeWidth="1.5"
                />
                <text
                  x={p.x}
                  y={p.y}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize={showNak ? '9' : '11'}
                  fill="#776342"
                  transform={`rotate(${90 - (i * 30 + 15) + (i * 30 + 15 > 180 ? 180 : 0)} ${p.x} ${p.y})`}
                >
                  {name}
                </text>
              </g>
            )
          })}
        {showNak &&
          nakshatras.map((n, i) => {
            const inner = showRashi ? 259 : 234,
              p = point(((i + 0.5) * 360) / 27, (inner + 282) / 2)
            return (
              <g
                key={n.name}
                role="button"
                tabIndex={0}
                className="clickable-sector"
                aria-label={`${n.name} nakshatra`}
                onClick={() => onMoon(((i + 0.5) * 360) / 27)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    onMoon(((i + 0.5) * 360) / 27)
                  }
                }}
              >
                <path
                  d={wedge(inner, 282, (i * 360) / 27, 360 / 27)}
                  fill={sectorIndex(moon, 27) === i ? '#31594f' : i % 2 ? '#e4e8dc' : '#ecede4'}
                  stroke="#f6f4ec"
                  strokeWidth="1"
                />
                <text
                  x={p.x}
                  y={p.y}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize="8.5"
                  fill={sectorIndex(moon, 27) === i ? '#fff' : '#556958'}
                  transform={`rotate(${90 - ((i + 0.5) * 360) / 27 + (((i + 0.5) * 360) / 27 > 180 ? 180 : 0)} ${p.x} ${p.y})`}
                >
                  {n.name
                    .replace('Pūrvabhādrapadā', 'P. Bhādrapadā')
                    .replace('Uttarabhādrapadā', 'U. Bhādrapadā')
                    .replace('Uttaraphalgunī', 'U. Phalgunī')
                    .replace('Pūrvaphalgunī', 'P. Phalgunī')}
                </text>
              </g>
            )
          })}
        {stellar &&
          padas &&
          Array.from({ length: 108 }, (_, i) => (
            <path
              key={i}
              d={wedge(211, 221, (i * 360) / 108, 360 / 108)}
              fill={sectorIndex(moon, 108) === i ? '#567998' : '#d9e1e4'}
              stroke="#f6f4ec"
              strokeWidth="0.7"
            />
          ))}
        {showDifference && delta > 0.05 && (
          <>
            <path d={`${arc(147, sun, delta)} L${CX},${CY} Z`} fill="#8caa86" fillOpacity="0.09" />
            <path
              d={arc(147, sun, delta)}
              fill="none"
              stroke="#31594f"
              strokeWidth="2"
              markerEnd="url(#green-arrow)"
            />
          </>
        )}
        {lesson === 0 && (
          <>
            <path
              d={arc(65, zero, mod(sun + offset))}
              fill="none"
              stroke="#bb892c"
              strokeWidth="1.6"
            />
            <path
              d={arc(98, zero, mod(moon + offset))}
              fill="none"
              stroke="#587f9c"
              strokeWidth="1.6"
            />
          </>
        )}
        <line
          x1={CX}
          y1={CY}
          x2={point(zero, outer + 14).x}
          y2={point(zero, outer + 14).y}
          stroke="#8d9582"
          strokeWidth="1.2"
        />
        <line x1={CX} y1={CY} x2={s.x} y2={s.y} stroke="#bc8b34" strokeWidth="1.6" />
        <line
          x1={s.x}
          y1={s.y}
          x2={point(sun, outer).x}
          y2={point(sun, outer).y}
          stroke="#bc8b34"
          strokeDasharray="3 4"
        />
        <line
          x1={CX}
          y1={CY}
          x2={m.x}
          y2={m.y}
          stroke="#5d83a0"
          strokeWidth="1.6"
          strokeDasharray={tilted && beta ? '3 4' : undefined}
        />
        <line
          x1={m.x}
          y1={m.y}
          x2={point(moon, outer).x}
          y2={point(moon, outer).y}
          stroke="#5d83a0"
          strokeDasharray="3 4"
        />
        {lesson === 4 &&
          [node, node + 180].map((angle, i) => {
            const p = point(angle, 195)
            return (
              <g key={i}>
                <line x1={CX} y1={CY} x2={p.x} y2={p.y} stroke="#a57979" strokeDasharray="4 5" />
                <circle cx={p.x} cy={p.y} r="7" fill="#f6f4ec" stroke="#a57979" strokeWidth="2" />
              </g>
            )
          })}
      </g>
      {lesson === 4 && (
        <path
          d={Array.from({ length: 361 }, (_, angle) => {
            const p = point(angle, 195)
            const lift = tilted
              ? 195 * Math.tan(lunarLatitude(angle, node) * DEG) * Math.sqrt(1 - yScale ** 2)
              : 0
            return `${angle ? 'L' : 'M'}${p.x},${CY + (p.y - CY) * yScale - lift}`
          }).join(' ')}
          fill="none"
          stroke="#64839c"
          strokeWidth="1.4"
          opacity=".8"
        />
      )}
      {Array.from({ length: 12 }, (_, i) => {
        const p = point(i * 30 + zero, stellar ? 304 : 271)
        return (
          <text
            key={i}
            x={p.x}
            y={CY + (p.y - CY) * yScale + 4}
            textAnchor="middle"
            className="degree-label"
          >
            {i * 30}°
          </text>
        )
      })}
      {tilted && (
        <>
          <path
            d={`M${m.x},${CY + (m.y - CY) * yScale}L${moonDisplay.x},${moonDisplay.y}`}
            stroke="#5d83a0"
            strokeWidth="1.5"
            strokeDasharray="3 3"
          />
          <line
            x1={CX}
            y1={CY}
            x2={moonDisplay.x}
            y2={moonDisplay.y}
            stroke="#5d83a0"
            strokeWidth="1.6"
          />
          <text x="360" y="512" textAnchor="middle" className="diagram-note">
            The ecliptic plane, viewed at an angle
          </text>
          <text x="360" y="533" textAnchor="middle" className="diagram-note small">
            β = {beta.toFixed(2)}° · dashed blue ray = projection into the plane
          </text>
        </>
      )}
      <g className="earth-mark" aria-label="Earth at the origin">
        <circle cx={CX} cy={CY} r="25" fill="#dce5d9" fillOpacity="0.6" />
        <circle cx={CX} cy={CY} r="17" fill="url(#earth-fill)" />
        <ellipse cx={CX} cy={CY} rx="7" ry="16" fill="none" stroke="#b7cbb9" strokeOpacity=".45" />
        <path
          d={`M${CX - 16},${CY}h32 M${CX - 14},${CY - 7}q14,-4 28,0 M${CX - 14},${CY + 7}q14,4 28,0`}
          fill="none"
          stroke="#b7cbb9"
          strokeOpacity=".45"
        />
        <text x={CX} y={CY + 44} textAnchor="middle" className="earth-label">
          EARTH
        </text>
      </g>
      <g
        className="draggable-body sun-body"
        role="slider"
        tabIndex={0}
        aria-label="Sun longitude on diagram"
        aria-valuemin={0}
        aria-valuemax={360}
        aria-valuenow={mod(sun + offset)}
        onKeyDown={(e) => keyMove(e, 'sun')}
        onPointerDown={(e) => begin(e, 'sun')}
      >
        <circle cx={sunDisplay.x} cy={sunDisplay.y} r="34" fill="url(#sun-halo)" />
        <circle cx={sunDisplay.x} cy={sunDisplay.y} r="24" fill="transparent" />
        <circle cx={sunDisplay.x} cy={sunDisplay.y} r="12" fill="#d9a84c" stroke="#bd8b35" />
        <circle cx={sunDisplay.x} cy={sunDisplay.y} r="8" fill="#e7bc66" />
        <title>Drag the Sun, or use arrow keys when focused</title>
      </g>
      <g
        className="draggable-body moon-body"
        role="slider"
        tabIndex={0}
        aria-label="Moon longitude on diagram"
        aria-valuemin={0}
        aria-valuemax={360}
        aria-valuenow={mod(moon + offset)}
        onKeyDown={(e) => keyMove(e, 'moon')}
        onPointerDown={(e) => begin(e, 'moon')}
      >
        <circle cx={moonDisplay.x} cy={moonDisplay.y} r="27" fill="#6e97b6" fillOpacity="0.10" />
        <circle cx={moonDisplay.x} cy={moonDisplay.y} r="11" fill="#7194aa" stroke="#567e99" />
        <circle cx={moonDisplay.x - 3} cy={moonDisplay.y - 3} r="3" fill="#a7bbc5" opacity=".7" />
        <circle cx={moonDisplay.x + 4} cy={moonDisplay.y + 4} r="2" fill="#527b94" opacity=".5" />
        <title>Drag the Moon, or use arrow keys when focused</title>
      </g>
      <text
        x={sunDisplay.x + (sunDisplay.x < CX ? 22 : -22)}
        y={sunDisplay.y + 31}
        textAnchor={sunDisplay.x < CX ? 'start' : 'end'}
        className="body-label sun-label"
      >
        Sun <tspan className="body-degrees">{degrees(sun + offset)}</tspan>
      </text>
      <text
        x={moonDisplay.x + (moonDisplay.x < CX - 25 ? -22 : 22)}
        y={moonDisplay.y + 31}
        textAnchor={labelAnchor(moonDisplay.x)}
        className="body-label moon-label"
      >
        Moon <tspan className="body-degrees">{degrees(moon + offset)}</tspan>
      </text>
      {showDifference &&
        delta > 8 &&
        (() => {
          const p = point(sun + delta / 2, 124)
          return (
            <text
              x={p.x}
              y={CY + (p.y - CY) * yScale + 4}
              textAnchor="middle"
              className="angle-label"
            >
              {delta.toFixed(1)}°
            </text>
          )
        })()}
      {!stellar && (
        <>
          <text
            x={point(zero, outer - 12).x}
            y={CY + (point(zero, outer - 12).y - CY) * yScale + 22}
            textAnchor="end"
            className="diagram-note small"
          >
            {offset ? 'tropical' : 'sidereal'} zero →
          </text>
          {!tilted && (
            <>
              <path
                d={arc(301, 65, 28)}
                fill="none"
                stroke="#81917b"
                strokeWidth="1"
                markerEnd="url(#green-arrow)"
              />
              <text x="390" y="36" className="diagram-note small">
                eastward
              </text>
            </>
          )}
        </>
      )}
    </svg>
  )
}
