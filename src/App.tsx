import { useEffect, useRef, useState } from 'react'
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Check,
  ChevronLeft,
  CircleHelp,
  Compass,
  Copy,
  Eye,
  Layers3,
  MoveUpRight,
  Pause,
  Play,
  RotateCcw,
  X,
} from 'lucide-react'
import { lessons, sources } from './content'
import {
  degrees,
  mod,
  tithiAt,
  stellarPosition,
  phaseName,
  meanPositions,
  SIDEREAL_MONTH,
  SYNODIC_MONTH,
  SOLAR_YEAR,
  lunarLatitude,
  angularDistance,
  skySeparation,
} from './astronomy'
import SkyDiagram, { MoonFace } from './components/SkyDiagram'
import { Disclosure, Note, Segmented, Slider, Toggle } from './components/Controls'
import LessonDetails from './components/LessonDetails'

type Scene = {
  lesson: number
  sun: number
  moon: number
  day: number
  step: number
  node: number
  tilted: boolean
  latitude: number
  frame: string
  ayanamsa: number
  grid: string
  padas: boolean
}
const defaults: Scene = {
  lesson: 0,
  sun: 32,
  moon: 128,
  day: 0,
  step: 0,
  node: 0,
  tilted: false,
  latitude: 0,
  frame: 'sidereal',
  ayanamsa: 24,
  grid: 'nakshatra',
  padas: false,
}
function initialScene(): Scene {
  const params = new URLSearchParams(location.search)
  try {
    const stored = params.has('scene')
      ? JSON.parse(params.get('scene')!)
      : JSON.parse(localStorage.getItem('tara-scene-v1') || '{}')
    const valid = { ...defaults }
    for (const key of ['sun', 'moon', 'node'] as const)
      if (typeof stored[key] === 'number' && Number.isFinite(stored[key]))
        valid[key] = mod(stored[key])
    if (Number.isInteger(stored.lesson) && stored.lesson >= 0 && stored.lesson < lessons.length)
      valid.lesson = stored.lesson
    if (
      Number.isInteger(stored.step) &&
      stored.step >= 0 &&
      stored.step < lessons[valid.lesson].steps.length
    )
      valid.step = stored.step
    for (const key of ['tilted', 'padas'] as const)
      if (typeof stored[key] === 'boolean') valid[key] = stored[key]
    if (stored.frame === 'tropical') valid.frame = stored.frame
    if (['nakshatra', 'rashi', 'both'].includes(stored.grid)) valid.grid = stored.grid
    if (typeof stored.day === 'number' && Number.isFinite(stored.day))
      valid.day = Math.min(60, Math.max(0, stored.day))
    if (typeof stored.latitude === 'number' && Number.isFinite(stored.latitude))
      valid.latitude = Math.min(5.2, Math.max(-5.2, stored.latitude))
    if (typeof stored.ayanamsa === 'number' && Number.isFinite(stored.ayanamsa))
      valid.ayanamsa = Math.min(40, Math.max(0, stored.ayanamsa))
    return valid
  } catch {
    return defaults
  }
}

function Brand() {
  return (
    <div className="brand">
      <svg width="35" height="35" viewBox="0 0 48 48" aria-hidden="true">
        <circle cx="24" cy="24" r="19" fill="none" stroke="currentColor" strokeWidth="1" />
        <path d="M24 3L27 21L45 24L27 27L24 45L21 27L3 24L21 21Z" fill="currentColor" />
        <circle cx="24" cy="24" r="3" fill="#f6f4ec" />
      </svg>
      <span>
        tārā<span className="brand-dot">.</span>
      </span>
    </div>
  )
}

export default function App() {
  const [scene, setScene] = useState<Scene>(initialScene)
  const [playing, setPlaying] = useState(false)
  const [copied, setCopied] = useState(false)
  const [shareError, setShareError] = useState(false)
  const [resourceTab, setResourceTab] = useState('sources')
  const dialog = useRef<HTMLDialogElement>(null)
  const copyTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const { lesson, sun, moon, day, step, node, tilted, latitude, frame, ayanamsa, grid, padas } =
    scene
  const current = lessons[lesson],
    guide = current.steps[step]
  const offset = frame === 'tropical' && (lesson === 0 || lesson === 2) ? ayanamsa : 0
  const t = tithiAt(sun, moon),
    n = stellarPosition(moon)
  const beta = lunarLatitude(moon, node)
  const patch = (values: Partial<Scene>) => setScene((s) => ({ ...s, ...values }))
  const stopPatch = (values: Partial<Scene>) => {
    setPlaying(false)
    patch(values)
  }
  const setSun = (a: number) =>
    lesson === 3
      ? setDay(Math.min(60, Math.max(0, day + ((mod(a - sun + 180) - 180) * SOLAR_YEAR) / 360)))
      : stopPatch({ sun: mod(a) })
  const setMoon = (a: number) =>
    lesson === 3
      ? setDay(
          Math.min(60, Math.max(0, day + ((mod(a - moon + 180) - 180) * SIDEREAL_MONTH) / 360)),
        )
      : stopPatch({ moon: mod(a) })
  const setDay = (d: number) => stopPatch({ day: d, ...meanPositions(d) })
  const setPhase = (angle: number) => setMoon(mod(sun + angle))

  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        localStorage.setItem('tara-scene-v1', JSON.stringify(scene))
      } catch {
        /* Storage is optional. */
      }
    }, 300)
    return () => clearTimeout(timer)
  }, [scene])
  useEffect(() => {
    if (!playing) return
    let last = performance.now(),
      id = 0
    function tick(now: number) {
      const elapsed = Math.min((now - last) / 1000, 0.1)
      last = now
      setScene((s) => {
        if (s.lesson === 3) {
          const d = s.day + elapsed * 1.5
          if (d >= 60) {
            setPlaying(false)
            return { ...s, day: 60, ...meanPositions(60) }
          }
          return { ...s, day: d, ...meanPositions(d) }
        }
        return {
          ...s,
          sun: mod(s.sun + (elapsed * 1.5 * 360) / SOLAR_YEAR),
          moon: mod(s.moon + (elapsed * 1.5 * 360) / SIDEREAL_MONTH),
        }
      })
      id = requestAnimationFrame(tick)
    }
    id = requestAnimationFrame(tick)
    const visibility = () => {
      if (document.hidden) setPlaying(false)
    }
    document.addEventListener('visibilitychange', visibility)
    return () => {
      cancelAnimationFrame(id)
      document.removeEventListener('visibilitychange', visibility)
    }
  }, [playing])
  useEffect(() => () => clearTimeout(copyTimer.current), [])

  function goLesson(index: number) {
    setPlaying(false)
    setScene((s) => ({
      ...s,
      lesson: index,
      step: 0,
      tilted: index === 4,
      latitude: 0,
      frame: 'sidereal',
      ...(index === 3 ? { day: 0, ...meanPositions(0) } : {}),
    }))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
  function goStep(index: number) {
    patch({ step: index })
    if (lesson === 0) patch({ tilted: index === 2 })
  }
  function experiment() {
    setPlaying(false)
    if (lesson === 0) {
      if (step === 0) patch({ sun: 32, moon: 128, tilted: false, latitude: 0 })
      if (step === 1) patch({ moon: mod(90 - offset), tilted: false })
      if (step === 2) patch({ tilted: true, latitude: 5.1, moon: 128 })
      if (step === 3) patch({ sun: 32, moon: 128, tilted: false })
    } else if (lesson === 1) {
      setPhase(step === 0 ? 0 : step === 1 ? 179 : 270)
    } else if (lesson === 2) {
      patch(
        step === 0
          ? { moon: 46.6666666667, grid: 'nakshatra' }
          : step === 1
            ? { moon: 30, grid: 'both' }
            : { padas: true, moon: 41.6666666667 },
      )
    } else if (lesson === 3) {
      if (step === 0) {
        patch({ day: 0, ...meanPositions(0) })
        setPlaying(true)
      } else setDay(step === 1 ? SIDEREAL_MONTH : SYNODIC_MONTH)
    } else if (lesson === 4) {
      patch(
        step === 0
          ? { sun: 0, moon: 0, node: 90, tilted: true }
          : step === 1
            ? { sun: 0, moon: 0, node: 0, tilted: true }
            : { sun: 0, moon: 180, node: 0, tilted: true },
      )
    } else {
      const target = document.getElementById(['panchanga', 'month-names', 'historical-map'][step])
      const disclosure = target?.querySelector<HTMLButtonElement>('.disclosure-heading')
      if (step === 2 && disclosure?.getAttribute('aria-expanded') === 'false') disclosure.click()
      target?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }
  function nextStep() {
    if (step < current.steps.length - 1) goStep(step + 1)
    else if (lesson < lessons.length - 1) goLesson(lesson + 1)
    else {
      setResourceTab('sources')
      dialog.current?.showModal()
    }
  }
  async function share() {
    setPlaying(false)
    const url = new URL(location.href)
    url.search = ''
    url.searchParams.set('scene', JSON.stringify(scene))
    url.hash = ''
    try {
      await navigator.clipboard.writeText(url.toString())
      setCopied(true)
      setShareError(false)
      clearTimeout(copyTimer.current)
      copyTimer.current = setTimeout(() => setCopied(false), 2200)
    } catch {
      history.replaceState(null, '', url)
      setShareError(true)
    }
  }
  function reset() {
    setPlaying(false)
    setScene({
      ...defaults,
      lesson,
      tilted: lesson === 4,
      ...(lesson === 3 ? { sun: 0, moon: 0 } : {}),
    })
  }
  const showResources = (tab: string) => {
    setPlaying(false)
    setResourceTab(tab)
    dialog.current?.showModal()
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <a
          className="brand-link"
          href="#"
          onClick={(e) => {
            e.preventDefault()
            goLesson(0)
          }}
          aria-label="Tārā home"
        >
          <Brand />
        </a>

        <div className="sidebar-divider" />

        <nav aria-label="Explorations">
          {lessons.map((l, i) => (
            <button
              key={i}
              className={`nav-item ${lesson === i ? 'active' : ''}`}
              aria-current={lesson === i ? 'step' : undefined}
              onClick={() => goLesson(i)}
            >
              <span className="nav-number">{String(i + 1).padStart(2, '0')}</span>
              <span>{l.short}</span>
              {lesson === i && <span className="nav-dot" />}
            </button>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <button className="sidebar-resource" onClick={() => showResources('sources')}>
            <BookOpen size={15} /> Notes & sources <ArrowUpRight size={14} />
          </button>
        </div>
      </aside>

      <div className="workspace">
        <main>
          <header className="page-heading">
            <h1>{current.title}</h1>
            <div className="page-actions">
              <button
                className="icon-button"
                aria-label="How to use this tool"
                onClick={() => showResources('help')}
              >
                <CircleHelp size={18} />
              </button>
              <button className="share-button" onClick={share}>
                {copied ? <Check size={14} /> : <Copy size={14} />}
                <span>{copied ? 'Copied' : 'Copy this view'}</span>
              </button>
            </div>
          </header>
          {shareError && (
            <div className="inline-notice" role="status">
              The view is saved in your address bar. Copy the browser’s URL to share it.
              <button
                className="icon-button"
                aria-label="Dismiss copy notice"
                onClick={() => setShareError(false)}
              >
                <X size={14} />
              </button>
            </div>
          )}

          <div className="lab-workbench">
            <section className="diagram-panel" aria-label="Interactive sky diagram">
              <div className="diagram-toolbar">
                <div className="diagram-view-title">
                  <Compass size={16} />
                  <span>Earth-centered</span>
                </div>
                {lesson === 0 || lesson === 4 ? (
                  <Segmented
                    label="Diagram perspective"
                    value={tilted ? 'tilted' : 'top'}
                    options={[
                      { value: 'top', label: 'From above', icon: <Eye size={13} /> },
                      { value: 'tilted', label: 'Tilt the plane', icon: <Layers3 size={13} /> },
                    ]}
                    onChange={(v) => patch({ tilted: v === 'tilted' })}
                  />
                ) : (
                  <span className="diagram-projection">View from ecliptic north</span>
                )}
              </div>
              <div className="diagram-canvas">
                <SkyDiagram
                  sun={sun}
                  moon={moon}
                  offset={offset}
                  lesson={lesson}
                  step={step}
                  tilted={tilted}
                  latitude={latitude}
                  grid={grid}
                  padas={padas}
                  node={node}
                  onSun={setSun}
                  onMoon={setMoon}
                />
              </div>

              <div className="readout-strip">
                <div>
                  <span className="readout-label">
                    <i className="legend-dot sun" />
                    SUN LONGITUDE
                  </span>
                  <strong className="sun-ink">
                    {degrees(sun + offset)}
                    <small>
                      λ<sub>S</sub>
                    </small>
                  </strong>
                </div>
                <div>
                  <span className="readout-label">
                    <i className="legend-dot moon" />
                    MOON LONGITUDE
                  </span>
                  <strong className="moon-ink">
                    {degrees(moon + offset)}
                    <small>
                      λ<sub>M</sub>
                    </small>
                  </strong>
                </div>
                <div>
                  <span className="readout-label">
                    {lesson === 2 ? 'MOON’S NAKṢATRA' : 'EASTWARD LEAD'}
                  </span>
                  <strong className={lesson === 2 ? 'text-readout' : ''}>
                    {lesson === 2 ? n.name : degrees(t.angle)}
                    <small>{lesson === 2 ? `pāda ${n.pada}` : 'Δλ'}</small>
                  </strong>
                </div>
              </div>
            </section>

            <aside className="inspector" aria-label="Lesson guide and sky controls">
              <section className="guide-card">
                <div className="guide-top">
                  <span>
                    {step + 1} / {current.steps.length}
                  </span>
                </div>
                <div className="step-track" aria-label="Guide steps">
                  {current.steps.map((s, i) => (
                    <button
                      key={i}
                      className={i <= step ? 'filled' : ''}
                      onClick={() => goStep(i)}
                      aria-label={`Step ${i + 1}: ${s.title}`}
                      aria-current={i === step ? 'step' : undefined}
                    />
                  ))}
                </div>
                <h2>{guide.title}</h2>
                <p>{guide.body}</p>
                <div className="try-this">
                  <p>{guide.task}</p>
                  <button className="experiment-button" onClick={experiment}>
                    {guide.action}
                    <ArrowUpRight size={14} />
                  </button>
                </div>
                <div className="guide-navigation">
                  <button
                    className="icon-button"
                    aria-label="Previous guide step"
                    disabled={step === 0}
                    onClick={() => goStep(step - 1)}
                  >
                    <ChevronLeft size={17} />
                  </button>
                  <button onClick={nextStep}>
                    {step < current.steps.length - 1
                      ? 'Next'
                      : lesson < 5
                        ? lessons[lesson + 1].short
                        : 'Sources'}
                    <ArrowRight size={15} />
                  </button>
                </div>
              </section>
              <section className="scene-controls">
                <div className="controls-heading">
                  <button className="reset-button" onClick={reset}>
                    <RotateCcw size={12} />
                    Reset
                  </button>
                </div>
                {lesson === 3 ? (
                  <>
                    <Slider
                      label="Days since an imagined new Moon"
                      value={day}
                      min={0}
                      max={60}
                      step={0.01}
                      suffix=" d"
                      onChange={setDay}
                    />
                    <div className="jump-buttons">
                      <button onClick={() => setDay(SIDEREAL_MONTH)}>
                        27.32 d <span>to the stars</span>
                      </button>
                      <button onClick={() => setDay(SYNODIC_MONTH)}>
                        29.53 d <span>to the Sun</span>
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <Slider
                      label="Sun longitude"
                      color="gold"
                      value={mod(sun + offset)}
                      onChange={(v) => setSun(mod(v - offset))}
                    />
                    <Slider
                      label="Moon longitude"
                      color="blue"
                      value={mod(moon + offset)}
                      onChange={(v) => setMoon(mod(v - offset))}
                    />
                  </>
                )}
                {lesson === 0 && tilted && (
                  <Slider
                    label="Moon latitude β"
                    value={latitude}
                    min={-5.2}
                    max={5.2}
                    step={0.1}
                    color="blue"
                    onChange={(v) => patch({ latitude: v })}
                  />
                )}
                {lesson === 0 && tilted && (
                  <div className="latitude-readout">
                    <span>Smaller separation on the 3D sky</span>
                    <b>{skySeparation(sun, moon, latitude).toFixed(2)}°</b>
                    <p>
                      This includes latitude. Tithi instead uses the directed longitude difference,{' '}
                      {degrees(t.angle)}, in the ecliptic plane.
                    </p>
                  </div>
                )}
                {lesson === 4 && (
                  <Slider
                    label="Ascending node · Rāhu"
                    value={node}
                    onChange={(v) => patch({ node: v })}
                  />
                )}
                {lesson === 2 && (
                  <div className="grid-controls">
                    <Segmented
                      label="Stellar grid"
                      value={grid}
                      options={[
                        { value: 'nakshatra', label: '27 stations' },
                        { value: 'rashi', label: '12 signs' },
                        { value: 'both', label: 'Both' },
                      ]}
                      onChange={(v) => patch({ grid: v })}
                    />
                    <Toggle checked={padas} onChange={(v) => patch({ padas: v })}>
                      Show the 108 pādas
                    </Toggle>
                  </div>
                )}
                {(lesson === 0 || lesson === 2) && (
                  <div className="frame-control">
                    <span className="control-caption">LONGITUDE ZERO</span>
                    <Segmented
                      label="Longitude reference frame"
                      value={frame}
                      options={[
                        { value: 'sidereal', label: 'Sidereal' },
                        { value: 'tropical', label: 'Tropical' },
                      ]}
                      onChange={(v) => patch({ frame: v })}
                    />
                    {frame === 'tropical' && (
                      <p className="mini-copy">
                        Illustrative offset: +{ayanamsa}°.{' '}
                        {lesson === 2
                          ? 'The station and sign sectors stay sidereal.'
                          : 'The bodies stay in place; the ruler’s zero moves.'}
                      </p>
                    )}
                  </div>
                )}
                {(lesson === 1 || lesson === 4 || lesson === 5) && (
                  <div className="phase-presets">
                    <div>
                      {[0, 90, 180, 270]
                        .filter((a) => lesson !== 4 || a === 0 || a === 180)
                        .map((a) => (
                          <button
                            key={a}
                            aria-label={`Set ${phaseName(a)}`}
                            aria-pressed={angularDistance(t.angle, a) < 0.05}
                            className={angularDistance(t.angle, a) < 0.05 ? 'active' : ''}
                            onClick={() => setPhase(a)}
                          >
                            <MoonFace angle={a} size={24} />
                            <span>{['New', 'First ¼', 'Full', 'Last ¼'][a / 90]}</span>
                          </button>
                        ))}
                    </div>
                  </div>
                )}
                {lesson !== 4 && (
                  <button
                    className={`play-button ${playing ? 'playing' : ''}`}
                    onClick={() => {
                      if (lesson === 3 && day >= 60) patch({ day: 0, ...meanPositions(0) })
                      setPlaying(!playing)
                    }}
                  >
                    {playing ? <Pause size={14} /> : <Play size={14} />}
                    <span>{playing ? 'Pause' : 'Play'}</span>
                  </button>
                )}
              </section>
            </aside>
          </div>

          {lesson === 1 ? (
            <section className="live-interpretation">
              <div className="phase-portrait">
                <MoonFace angle={t.angle} size={76} />
                <span>{phaseName(t.angle)}</span>
              </div>
              <div className="live-tithi">
                <h2>
                  {t.paksha} {t.name}
                </h2>
                <p>
                  Tithi {t.number} of the {t.waxing ? 'waxing' : 'waning'} half · approximately{' '}
                  {(t.illumination * 100).toFixed(0)}% illuminated
                </p>
              </div>
              <div className="live-equation">
                <div>
                  <b>{degrees(moon)}</b> − <b>{degrees(sun)}</b> <span>→</span>{' '}
                  <strong>{degrees(t.angle)}</strong>
                </div>
                <p>wrap to 0–360°, then floor(Δλ / 12°) + 1 = {t.index + 1}</p>
              </div>
            </section>
          ) : lesson === 3 ? (
            <div className="clock-counters">
              <div>
                <span className="eyebrow">TURNS AGAINST THE STARS</span>
                <strong>{(day / SIDEREAL_MONTH).toFixed(3)}</strong>
                <p>One turn every {SIDEREAL_MONTH.toFixed(2)} days</p>
              </div>
              <div>
                <span className="eyebrow">TURNS RELATIVE TO THE SUN</span>
                <strong>{(day / SYNODIC_MONTH).toFixed(3)}</strong>
                <p>One phase cycle every {SYNODIC_MONTH.toFixed(2)} days</p>
              </div>
              <div className="clock-phase">
                <MoonFace angle={t.angle} size={64} />
                <p>
                  {phaseName(t.angle)}
                  <br />
                  <b>Day {day.toFixed(2)}</b>
                </p>
              </div>
            </div>
          ) : lesson === 4 ? (
            <div className="takeaway-strip">
              <span className="takeaway-symbol">β</span>
              <div>
                <p>
                  Eastward lead <em>{degrees(t.angle)}</em>. Lunar latitude{' '}
                  <em>{beta.toFixed(2)}°</em>.<br />
                  <span className="small-copy">
                    {(angularDistance(t.angle, 0) < 0.05 || angularDistance(t.angle, 180) < 0.05) &&
                    Math.abs(beta) < 0.01
                      ? 'Exact central alignment in this idealized geometry.'
                      : 'Move new or full Moon to a node to create central alignment.'}
                  </span>
                </p>
              </div>
            </div>
          ) : null}

          <div className="lesson-details">
            <LessonDetails
              lesson={lesson}
              sun={sun}
              moon={moon}
              node={node}
              day={day}
              onMoon={setMoon}
              onScene={(s, m) => stopPatch({ sun: s, moon: m })}
            />
          </div>
          <nav className="lesson-navigation" aria-label="Adjacent topics">
            <button disabled={lesson === 0} onClick={() => goLesson(lesson - 1)}>
              <ArrowLeft size={15} />
              {lesson > 0 ? lessons[lesson - 1].short : 'Previous'}
            </button>
            <button onClick={() => (lesson < 5 ? goLesson(lesson + 1) : showResources('sources'))}>
              {lesson < 5 ? lessons[lesson + 1].short : 'Sources'}
              <ArrowRight size={15} />
            </button>
          </nav>
        </main>
      </div>

      <dialog
        ref={dialog}
        className="resource-dialog"
        aria-label="Notes and sources"
        onClick={(e) => {
          if (e.target === e.currentTarget) dialog.current?.close()
        }}
      >
        <div className="dialog-content">
          <div className="dialog-top">
            <Brand />
            <button
              className="icon-button"
              aria-label="Close notes and sources"
              onClick={() => dialog.current?.close()}
            >
              <X size={20} />
            </button>
          </div>
          <Segmented
            label="Reference sections"
            value={resourceTab}
            options={[
              { value: 'sources', label: 'Reading list' },
              { value: 'help', label: 'How to explore' },
              { value: 'model', label: 'About the model' },
            ]}
            onChange={setResourceTab}
          />
          {resourceTab === 'sources' ? (
            <>
              <h2>References</h2>
              <div className="source-list">
                {sources.map((s, i) => (
                  <a key={s.url} href={s.url} target="_blank" rel="noreferrer">
                    <span className="index-number">{String(i + 1).padStart(2, '0')}</span>
                    <div>
                      <small>{s.author}</small>
                      <h3>{s.title}</h3>
                      <p>{s.topic}</p>
                    </div>
                    <ArrowUpRight size={17} />
                  </a>
                ))}
              </div>
            </>
          ) : resourceTab === 'help' ? (
            <>
              <h2>Controls</h2>
              <div className="help-list">
                <div>
                  <MoveUpRight />
                  <p>
                    <b>Grab a body.</b> Drag the gold Sun or blue Moon around Earth. Sliders and
                    exact number fields offer the same control.
                  </p>
                </div>
                <div>
                  <BookOpen />
                  <p>
                    <b>Follow an idea.</b> The steps beside each diagram explain one concept at a
                    time. Use its experiment button to set a revealing scene, then explore freely.
                  </p>
                </div>
                <div>
                  <Eye />
                  <p>
                    <b>Look from another angle.</b> Tilt the ecliptic, change coordinate origins
                    below the first diagram, or switch the zero from sidereal to tropical.
                  </p>
                </div>
                <div>
                  <Compass />
                  <p>
                    <b>Explore in any order.</b> Use the chapter navigation. Your Sun and Moon carry
                    across chapters, except the two-clock model, which starts at an imagined new
                    Moon.
                  </p>
                </div>
                <div>
                  <Copy />
                  <p>
                    <b>Keep a useful scene.</b> This browser remembers your position. “Copy this
                    view” includes the scene and settings in a shareable URL.
                  </p>
                </div>
              </div>
              <Note title="Keyboard and touch work too">
                Tab to a Sun or Moon handle, then use arrow keys for 1° steps or Shift + arrow for
                10°. Use Home for zero. All ring selections also respond to Enter or Space.
                Animation starts only when requested.
              </Note>
            </>
          ) : (
            <>
              <h2>Model assumptions</h2>
              <p>
                This is an interactive geometry notebook. The positions are yours to set; they do
                not represent the sky at the current date.
              </p>
              <Disclosure title="Distances, planes, and apparent phase" initiallyOpen>
                <p>
                  Body sizes and distances in the main diagram are schematic. The sightline angles
                  and equal-sector boundaries are calculated. Tilted views project the ecliptic and
                  the Moon’s latitude into a drawing.
                </p>
                <p>
                  Phase portraits use the coplanar, distant-Sun approximation: illuminated fraction
                  ≈ (1 − cos Δλ) / 2. Their orientation is diagrammatic, not a prediction of the
                  Moon’s rotation relative to your horizon.
                </p>
              </Disclosure>
              <Disclosure title="Time, frames, and calendar limits" initiallyOpen>
                <p>
                  Animation uses uniform mean motion. It omits orbital eccentricity, perturbations,
                  light-time corrections, and location-dependent effects. The sidereal frame is
                  conventional; the reference-frame switch uses an illustrative 24° ayanāṃśa.
                </p>
                <p>
                  Tithis, nakṣatras, pādas, yoga, and karaṇa are computed from the scene. Actual
                  dates, sunrise assignments, festival rules, and horoscopes require further
                  conventions and accurate ephemerides.
                </p>
              </Disclosure>
              <Disclosure title="Historical layers and astrological interpretation" initiallyOpen>
                <p>
                  The equal nakṣatra grid is distinguished from stellar landmarks and older lists.
                  Star identifications and divine associations have variants. Historical context is
                  provided separately, with contested dating noted.
                </p>
                <p>
                  The optional Viṃśottarī example demonstrates traditional proportional arithmetic.
                  It does not validate astrological predictions. Historical astronomy, ritual
                  timekeeping, and astrology are related without being interchangeable.
                </p>
              </Disclosure>
            </>
          )}
        </div>
      </dialog>
      <span className="sr-only" role="status">
        {copied ? 'View link copied to clipboard.' : ''}
      </span>
    </div>
  )
}
