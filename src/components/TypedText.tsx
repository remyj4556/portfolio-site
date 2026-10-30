import { useEffect, useState } from 'react'
import { VisuallyHidden } from './VisuallyHidden.tsx'
import styles from './TypedText.module.css'

const HOLD_MS = 2000
const DELETE_MS = 35
const GAP_MS = 500
const TYPE_MS = 70

type Phase = 'hold' | 'deleting' | 'gap' | 'typing'
type State = { index: number; shown: number; phase: Phase }

type Props = {
  phrases: readonly [string, ...string[]]
  paused: boolean
  reducedMotion: boolean
  className?: string
}

// The loop as a state machine: each state schedules the next one.
function nextStep(state: State, phrases: readonly string[]): { state: State; delay: number } {
  const length = phrases[state.index].length
  switch (state.phase) {
    case 'hold':
      return { state: { ...state, phase: 'deleting', shown: length }, delay: HOLD_MS }
    case 'deleting': {
      const shown = Math.max(state.shown - 1, 0)
      return { state: { ...state, shown, phase: shown === 0 ? 'gap' : 'deleting' }, delay: DELETE_MS }
    }
    case 'gap':
      return { state: { index: (state.index + 1) % phrases.length, shown: 0, phase: 'typing' }, delay: GAP_MS }
    case 'typing': {
      const shown = Math.min(state.shown + 1, length)
      return { state: { ...state, shown, phase: shown >= length ? 'hold' : 'typing' }, delay: TYPE_MS }
    }
  }
}

export function TypedText({ phrases, paused, reducedMotion, className }: Props) {
  const active = !paused && !reducedMotion
  const [state, setState] = useState<State>({ index: 0, shown: phrases[0].length, phase: 'hold' })

  // Pausing (or reduced motion) completes the phrase; resuming starts a fresh hold.
  // Reduced motion shows the first phrase. Adjusted during render, per React's
  // "storing information from previous renders" pattern.
  const [previous, setPrevious] = useState({ active, reducedMotion })
  if (previous.active !== active || previous.reducedMotion !== reducedMotion) {
    setPrevious({ active, reducedMotion })
    const index = reducedMotion ? 0 : state.index
    setState({ index, shown: phrases[index].length, phase: 'hold' })
  }

  useEffect(() => {
    if (!active) return
    const step = nextStep(state, phrases)
    const timer = window.setTimeout(() => setState(step.state), step.delay)
    return () => window.clearTimeout(timer)
  }, [active, state, phrases])

  const phrase = phrases[state.index]
  const text = active ? phrase.slice(0, state.shown) : phrase

  return (
    <div className={`${styles.typed} ${className ?? ''}`}>
      {phrases.map((sizer, i) => (
        <span key={i} className={`${styles.cell} ${styles.sizer}`} aria-hidden="true">
          {sizer}
          <span className={styles.cursor} />
        </span>
      ))}
      <span className={styles.cell} aria-hidden="true">
        {text}
        <span className={`${styles.cursor} ${active ? styles.blink : ''}`} />
      </span>
      <VisuallyHidden>{phrases.join('. ')}</VisuallyHidden>
    </div>
  )
}
