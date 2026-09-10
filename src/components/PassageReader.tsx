import { useEffect, useRef, useState } from 'react'
import { ArrowLeft, ArrowUpRight, BookOpen, ChevronRight } from 'lucide-react'
import { passageById, type OpenPassage, type Passage } from '../passages'

export function PassageLink({ ids, onOpen }: { ids: string[]; onOpen: OpenPassage }) {
  if (!ids.length) return null
  return (
    <button className="passage-link" onClick={() => onOpen(ids[0], ids)}>
      <BookOpen size={14} aria-hidden="true" />
      <span>Read {ids.length === 1 ? 'passage' : 'passages'}</span>
      <ChevronRight size={13} aria-hidden="true" />
    </button>
  )
}

function SanskritText({ passage }: { passage: Passage }) {
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading')
  const [attempt, setAttempt] = useState(0)
  useEffect(() => {
    let active = true
    setStatus('loading')
    // Never display the quotation in a silently substituted system font.
    const loading =
      attempt === 0
        ? document.fonts.load('28px "Shobhika"', passage.sanskrit)
        : new FontFace(
            'Shobhika',
            `url("/fonts/shobhika-regular.woff2?retry=${attempt}") format("woff2")`,
          )
            .load()
            .then((face) => {
              if (active) document.fonts.add(face)
              return [face]
            })
    loading.then(
      (faces) => {
        if (active) setStatus(faces.length ? 'ready' : 'error')
      },
      () => {
        if (active) setStatus('error')
      },
    )
    return () => {
      active = false
    }
  }, [passage.sanskrit, attempt])

  return (
    <div className="sanskrit-block" aria-busy={status === 'loading'}>
      <h3>Sanskrit</h3>
      {status === 'ready' ? (
        <p className="vedic-text" lang="sa-Deva" dir="ltr" data-accented={passage.accented}>
          {passage.sanskrit}
        </p>
      ) : (
        <div className="font-status" role="status">
          {status === 'loading' ? (
            'Loading Sanskrit typography…'
          ) : (
            <>
              <p>The Vedic font could not load.</p>
              <button onClick={() => setAttempt((n) => n + 1)}>Retry</button>
              <a href={passage.source.url} target="_blank" rel="noreferrer">
                Read the source page <ArrowUpRight size={12} />
              </a>
            </>
          )}
        </div>
      )}
      <details className="reader-disclosure">
        <summary>IAST transliteration</summary>
        <p className="iast-text" lang="sa-Latn">
          {passage.iast}
        </p>
        <p className="reader-note">
          Reading aid without accent notation. The Sanskrit above retains the source’s marks.
        </p>
      </details>
    </div>
  )
}

export default function PassageReader({
  id,
  collection,
  onSelect,
  onClose,
}: {
  id: string
  collection: string[]
  onSelect: (id: string) => void
  onClose: () => void
}) {
  const passage = passageById.get(id)!
  const dialog = useRef<HTMLDialogElement>(null)
  const title = useRef<HTMLHeadingElement>(null)
  const scroll = useRef<HTMLDivElement>(null)
  const close = useRef(onClose)
  close.current = onClose
  const [iastOpen, setIastOpen] = useState(() => {
    try {
      return localStorage.getItem('tara-iast-open') === 'true'
    } catch {
      return false
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem('tara-iast-open', String(iastOpen))
    } catch {
      /* Reading preferences are optional. */
    }
  }, [iastOpen])

  useEffect(() => {
    const el = dialog.current!
    const mobile = window.matchMedia('(max-width: 1000px)')
    const overflow = document.body.style.overflow
    const present = () => {
      if (el.open) el.close()
      if (mobile.matches) el.showModal()
      else el.show()
      document.body.style.overflow = mobile.matches ? 'hidden' : overflow
    }
    const escape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !mobile.matches && !document.querySelector('dialog:modal')) {
        event.preventDefault()
        close.current()
      }
    }
    present()
    mobile.addEventListener('change', present)
    document.addEventListener('keydown', escape)
    return () => {
      mobile.removeEventListener('change', present)
      document.removeEventListener('keydown', escape)
      document.body.style.overflow = overflow
      if (el.open) el.close()
    }
  }, [])

  useEffect(() => {
    scroll.current?.scrollTo({ top: 0 })
    title.current?.focus({ preventScroll: true })
  }, [id])

  // The native disclosure's state survives changing passages, without storing scene state.
  useEffect(() => {
    const details = dialog.current?.querySelector<HTMLDetailsElement>('.sanskrit-block details')
    if (!details) return
    details.open = iastOpen
    const changed = () => setIastOpen(details.open)
    details.addEventListener('toggle', changed)
    return () => details.removeEventListener('toggle', changed)
  }, [iastOpen, id])

  return (
    <dialog
      ref={dialog}
      className="passage-reader"
      aria-label="Vedic passage reader"
      onClose={() => {
        if (!dialog.current?.open) close.current()
      }}
      onCancel={(event) => {
        event.preventDefault()
        onClose()
      }}
    >
      <header className="reader-toolbar">
        <button onClick={onClose} aria-label="Close passage and return to exploration">
          <ArrowLeft size={15} /> Back to exploration
        </button>
      </header>
      <div ref={scroll} className="reader-scroll">
        <article>
          <p className="reader-citation">{passage.citation}</p>
          <h2 ref={title} tabIndex={-1}>
            {passage.title}
          </h2>
          <p className="reader-tradition">{passage.tradition}</p>
          <div className="passage-meaning">
            <p>{passage.meaning}</p>
            <span>English meaning · Tārā paraphrase</span>
          </div>
          <SanskritText passage={passage} />
          <section className="passage-connection" aria-label="Connection to the diagram">
            <h3>Connection to the diagram</h3>
            <p>{passage.connection}</p>
          </section>
          <dl className="passage-terms">
            {passage.terms.map(([term, meaning]) => (
              <div key={term}>
                <dt lang="sa-Latn">{term}</dt>
                <dd>{meaning}</dd>
              </div>
            ))}
          </dl>
          <details className="reader-disclosure">
            <summary>Context & edition</summary>
            <p>{passage.context}</p>
            <p>{passage.editorialNote}</p>
            <p>
              English meanings are editorial paraphrases, checked with the edition or translation
              linked below.
            </p>
            <div className="reader-source-links">
              {passage.witness && (
                <a href={passage.witness.url} target="_blank" rel="noreferrer">
                  {passage.witness.label} <ArrowUpRight size={12} />
                </a>
              )}
              <a href={passage.translationSource.url} target="_blank" rel="noreferrer">
                {passage.translationSource.label} <ArrowUpRight size={12} />
              </a>
            </div>
            <p className="reader-note">
              Typeset in{' '}
              <a
                href="https://github.com/Sandhi-IITBombay/Shobhika"
                target="_blank"
                rel="noreferrer"
              >
                Shobhika 1.05 · IIT Bombay
              </a>
              .
              {passage.accented
                ? ' Unicode svara marks are retained from the accented source.'
                : ' This edition has no svara marks for this verse.'}
            </p>
          </details>
          <a className="reader-source" href={passage.source.url} target="_blank" rel="noreferrer">
            <span>{passage.source.label}</span>
            <ArrowUpRight size={14} />
          </a>
        </article>
        {collection.length > 1 && (
          <nav className="related-passages" aria-label="Related passages">
            <h3>Related passages</h3>
            {collection
              .filter((other) => other !== id)
              .map((other) => {
                const p = passageById.get(other)!
                return (
                  <button key={other} onClick={() => onSelect(other)}>
                    <span>
                      {p.title}
                      <small>{p.citation}</small>
                    </span>
                    <ChevronRight size={14} />
                  </button>
                )
              })}
          </nav>
        )}
      </div>
    </dialog>
  )
}
