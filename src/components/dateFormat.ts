const dateFormat = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' })

export const formatDate = (date: Date) => dateFormat.format(date)

// Parse YYYY-MM-DD as a local date. `new Date("YYYY-MM-DD")` parses as UTC,
// which shows the previous day in US time zones.
export function parseLocalDate(value: string): Date {
  const [year, month, day] = value.split('-').map(Number)
  return new Date(year, month - 1, day)
}
