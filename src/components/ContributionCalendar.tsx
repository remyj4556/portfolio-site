import type { ContributionDay } from '../data/contributions.types.ts'
import { formatDate, parseLocalDate } from './dateFormat.ts'
import styles from './ContributionCalendar.module.css'

const CELL = 11
const GAP = 3
const STEP = CELL + GAP
const RADIUS = 2
const LEFT = 32 // weekday label column
const TOP = 18 // month label row
const MIN_LABEL_GAP = 3 // columns

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const WEEKDAY_LABELS = [
  { row: 1, label: 'Mon' },
  { row: 3, label: 'Wed' },
  { row: 5, label: 'Fri' },
]
const LEVELS = [0, 1, 2, 3, 4] as const

type Props = { weeks: { days: ContributionDay[] }[]; label: string }

function dayTitle(day: ContributionDay) {
  const date = formatDate(parseLocalDate(day.date))
  if (day.count === 0) return `No contributions on ${date}`
  return `${day.count} ${day.count === 1 ? 'contribution' : 'contributions'} on ${date}`
}

// A label goes above each column whose first day is in a different month from
// the previous column's first day. Labels with fewer than 3 columns before the
// next label (or the grid's end) are skipped so partial months don't overlap.
function monthLabels(weeks: Props['weeks']) {
  const starts: { column: number; month: number }[] = []
  let previousMonth: number | null = null
  weeks.forEach((week, column) => {
    if (week.days.length === 0) return
    const month = parseLocalDate(week.days[0].date).getMonth()
    if (month !== previousMonth) starts.push({ column, month })
    previousMonth = month
  })
  return starts.filter((start, i) => {
    const nextColumn = i + 1 < starts.length ? starts[i + 1].column : weeks.length
    return nextColumn - start.column >= MIN_LABEL_GAP
  })
}

export function ContributionCalendar({ weeks, label }: Props) {
  const width = LEFT + weeks.length * STEP - GAP
  const height = TOP + 7 * STEP - GAP

  return (
    <div className={styles.calendar}>
      <svg className={styles.grid} width={width} height={height} viewBox={`0 0 ${width} ${height}`} role="img" aria-label={label}>
        {monthLabels(weeks).map(({ column, month }) => (
          <text key={column} className={styles.label} x={LEFT + column * STEP} y={TOP - 6}>
            {MONTHS[month]}
          </text>
        ))}
        {WEEKDAY_LABELS.map(({ row, label }) => (
          <text key={label} className={styles.label} x={0} y={TOP + row * STEP + CELL / 2} dominantBaseline="central">
            {label}
          </text>
        ))}
        {weeks.map((week, column) =>
          week.days.map((day) => (
            <rect
              key={day.date}
              className={styles[`level-${day.level}`]}
              x={LEFT + column * STEP}
              y={TOP + day.weekday * STEP}
              width={CELL}
              height={CELL}
              rx={RADIUS}
            >
              <title>{dayTitle(day)}</title>
            </rect>
          )),
        )}
      </svg>

      <div className={styles.legend} aria-hidden="true">
        <span>Less</span>
        <svg width={LEVELS.length * STEP - GAP} height={CELL} viewBox={`0 0 ${LEVELS.length * STEP - GAP} ${CELL}`}>
          {LEVELS.map((level) => (
            <rect key={level} className={styles[`level-${level}`]} x={level * STEP} y={0} width={CELL} height={CELL} rx={RADIUS} />
          ))}
        </svg>
        <span>More</span>
      </div>
    </div>
  )
}
