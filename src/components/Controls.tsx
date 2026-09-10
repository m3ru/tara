import { useId, useState, type ReactNode } from 'react'
import { ChevronDown, ArrowUpRight, Lightbulb } from 'lucide-react'
export function Slider({
  label,
  value,
  min = 0,
  max = 359.9,
  step = 0.1,
  onChange,
  color = 'green',
  suffix = '°',
}: {
  label: string
  value: number
  min?: number
  max?: number
  step?: number
  onChange: (n: number) => void
  color?: string
  suffix?: string
}) {
  const id = useId()
  return (
    <div className={`slider-control ${color}`}>
      <div className="control-label">
        <label htmlFor={id}>{label}</label>
        <div className="number-wrap">
          <input
            aria-label={`${label} exact value`}
            type="number"
            min={min}
            max={max}
            step={step}
            value={Number(value.toFixed(2))}
            onChange={(e) => {
              if (e.target.value !== '')
                onChange(Math.min(max, Math.max(min, Number(e.target.value))))
            }}
          />
          <span>{suffix}</span>
        </div>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        style={{ '--progress': `${((value - min) / (max - min)) * 100}%` } as React.CSSProperties}
      />
      <div className="range-limits">
        <span>
          {min}
          {suffix}
        </span>
        <span>
          {max === 359.9 ? '360' : max}
          {suffix}
        </span>
      </div>
    </div>
  )
}
export function Segmented({
  label,
  value,
  options,
  onChange,
}: {
  label: string
  value: string
  options: { value: string; label: string; icon?: ReactNode }[]
  onChange: (value: string) => void
}) {
  return (
    <div className="segmented" role="group" aria-label={label}>
      {options.map((o) => (
        <button
          key={o.value}
          aria-pressed={value === o.value}
          className={value === o.value ? 'selected' : ''}
          onClick={() => onChange(o.value)}
        >
          {o.icon}
          {o.label}
        </button>
      ))}
    </div>
  )
}
export function Toggle({
  checked,
  onChange,
  children,
}: {
  checked: boolean
  onChange: (b: boolean) => void
  children: ReactNode
}) {
  return (
    <label className="toggle-label">
      <span>{children}</span>
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      <span className="toggle-track" aria-hidden="true" />
    </label>
  )
}
export function Note({
  title,
  children,
  icon = true,
}: {
  title: string
  children: ReactNode
  icon?: boolean
}) {
  return (
    <div className="note">
      <div className="note-heading">
        {icon && <Lightbulb size={16} />}
        <span>{title}</span>
      </div>
      <div>{children}</div>
    </div>
  )
}
export function Disclosure({
  title,
  children,
  initiallyOpen = false,
}: {
  title: string
  children: ReactNode
  initiallyOpen?: boolean
}) {
  const [open, setOpen] = useState(initiallyOpen)
  const id = useId()
  return (
    <div className={`disclosure ${open ? 'open' : ''}`}>
      <button
        className="disclosure-heading"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-controls={id}
      >
        {title}
        <ChevronDown size={16} />
      </button>
      {open && (
        <div id={id} className="disclosure-body">
          {children}
        </div>
      )}
    </div>
  )
}
export function SourceLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a className="source-link" href={href} target="_blank" rel="noreferrer">
      {children}
      <ArrowUpRight size={13} />
    </a>
  )
}
