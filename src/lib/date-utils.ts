/**
 * Check if an event date is in the future (upcoming).
 * Compares only the date portion (ignores time).
 */
export function isUpcoming(eventDate: string): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const event = new Date(eventDate);
  event.setHours(0, 0, 0, 0);
  return event >= today;
}

/**
 * Format a date string using Indonesian locale.
 */
export function formatDateID(
  eventDate: string,
  options?: Intl.DateTimeFormatOptions,
): string {
  const date = new Date(eventDate);
  return date.toLocaleDateString("id-ID", options);
}

/**
 * Format date in compact month-year format (e.g. "Okt 2025").
 */
export function formatMonthYear(eventDate: string): string {
  return formatDateID(eventDate, { year: "numeric", month: "short" });
}

/**
 * Format date in full format (e.g. "1 Oktober 2025").
 */
export function formatFullDate(eventDate: string): string {
  return formatDateID(eventDate, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
