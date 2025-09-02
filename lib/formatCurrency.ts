/**
 * Formats a number as currency.
 * @param value The number to format
 * @param currency The currency code (default: 'USD')
 * @param locale The locale (default: 'en-US')
 */
export function formatCurrency(
  value: number,
  currency: string = "USD",
  locale: string = "en-US"
): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}