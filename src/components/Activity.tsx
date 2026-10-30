import { useEffect, useRef } from 'react'
import contributions from '../data/contributions.json'
import type { ContributionData } from '../data/contributions.types.ts'
import { githubUrl } from '../content/derived.ts'
import { ContributionCalendar } from './ContributionCalendar.tsx'
import { formatDate } from './dateFormat.ts'
import { ExternalLink } from './ExternalLink.tsx'
import styles from './Activity.module.css'

const data = contributions as ContributionData
const numberFormat = new Intl.NumberFormat('en-US')

function totalText(total: number) {
  return `${numberFormat.format(total)} ${total === 1 ? 'contribution' : 'contributions'} in the last year`
}

export function Activity() {
  const scrollRef = useRef<HTMLDivElement>(null)

  // Start scrolled to the most recent weeks when the calendar overflows (mobile).
  useEffect(() => {
    const el = scrollRef.current
    if (el) el.scrollLeft = el.scrollWidth
  }, [])

  const githubLink = <ExternalLink href={githubUrl}>View on GitHub</ExternalLink>

  return (
    <section id="activity" className="section">
      <div className="container">
        <h2 className="section-heading">
          <span className="prompt" aria-hidden="true">&gt; </span>activity
        </h2>

        {data.status === 'ok' ? (
          <>
            <p className={styles.total}>{totalText(data.total)}</p>
            <div ref={scrollRef} className={styles.scroller} tabIndex={0} role="region" aria-label="Contribution calendar">
              <ContributionCalendar weeks={data.weeks} label={totalText(data.total)} />
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
