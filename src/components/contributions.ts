import contributions from '../data/contributions.json'
import type { ContributionData } from '../data/contributions.types.ts'

export const data = contributions as ContributionData

const numberFormat = new Intl.NumberFormat('en-US')

export const formatCount = (count: number) => numberFormat.format(count)

export function totalText(total: number) {
  return `${numberFormat.format(total)} ${total === 1 ? 'contribution' : 'contributions'} in the last year`
}
