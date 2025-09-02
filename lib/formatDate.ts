/**
 * Formats a date to a readable string.
 * @param date Date object or string
 * @param locale Locale string (default: 'en-US')
 * @param options Intl.DateTimeFormatOptions
 */
export function formatDate(
  date: Date | string,
  locale: string = "en-US",
  options?: Intl.DateTimeFormatOptions
): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat(locale, options).format(d);
}