/**
 * Format task estimate (in minutes) to human-readable duration
 * @param minutes - Estimate in minutes (typically 30 or 60)
 * @returns Formatted string like "<30m" or "<1hr"
 */
export function formatEstimate(minutes: number): string {
  if (minutes < 60) {
    return `<${minutes}m`;
  }
  const hours = minutes / 60;
  return `<${hours}hr`;
}
