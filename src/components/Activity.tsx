import { useEffect, useRef } from 'react'
import { githubUrl } from '../content/derived.ts'
import { ContributionCalendar } from './ContributionCalendar.tsx'
import { data, formatCount, totalText } from './contributions.ts'
import { formatDate } from './dateFormat.ts'
import { ExternalLink } from './ExternalLink.tsx'
import styles from './Activity.module.css'

export function Activity() {
  const scrollRef = useRef<HTMLDivElement>(null)

  // Start scrolled to the most recent weeks when the calendar overflows (mobile).
  useEffect(() => {
    const el = scrollRef.current
    if (el) el.scrollLeft = el.scrollWidth
  }, [])

  const githubLink = <ExternalLink href={githubUrl}>View on GitHub</ExternalLink>

  return (
    <section id="activity" className={`section bg-dots ${styles.section}`} aria-labelledby="activity-h">
      <div className="wrap">
        <div className="section-head">
          <h2 id="activity-h" className="prompt-heading">
            <span className="prompt" aria-hidden="true">&gt; </span>activity
          </h2>
        </div>

        {data.status === 'ok' ? (
          <>
            <div className={styles.layout}>
              <p className={styles.stat}>
                <span className={styles.number}>{formatCount(data.total)}</span>
                <span className={styles.label}>
                  {' '}
                  {data.total === 1 ? 'contribution' : 'contributions'} in the last year
                </span>
              </p>
              <div ref={scrollRef} className={styles.scroller} tabIndex={0} role="region" aria-label="Contribution calendar">
                <ContributionCalendar weeks={data.weeks} label={totalText(data.total)} />
              </div>
            </div>
            <p className={styles.meta}>
              Updated {formatDate(new Date(data.fetchedAt))} · {githubLink}
            </p>
          </>
        ) : (
          <p className={styles.meta}>Contribution activity is unavailable right now. {githubLink}</p>
        )}
      </div>
    </section>
  )
}
