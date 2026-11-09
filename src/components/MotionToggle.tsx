import styles from './MotionToggle.module.css'

type Props = { paused: boolean; onToggle: () => void }

// The brackets are drawn in CSS: the layout kit flags bracketed text as unfinished content.
export function MotionToggle({ paused, onToggle }: Props) {
  return (
    <button type="button" className={styles.toggle} aria-pressed={paused} onClick={onToggle}>
      {paused ? 'resume motion' : 'pause motion'}
    </button>
  )
}
