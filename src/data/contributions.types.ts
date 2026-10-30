export type ContributionLevel = 0 | 1 | 2 | 3 | 4; // NONE, FIRST_QUARTILE … FOURTH_QUARTILE
export type ContributionDay = {
  date: string;        // YYYY-MM-DD
  weekday: number;     // 0 = Sunday … 6 = Saturday (from GitHub)
  count: number;
  level: ContributionLevel;
};
export type ContributionData =
  | { status: "ok"; fetchedAt: string /* ISO 8601 */; total: number; weeks: { days: ContributionDay[] }[] }
  | { status: "unavailable"; reason: "no-token" };
