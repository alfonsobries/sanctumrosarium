/** Shared formatters: dates always go through here, never inline toLocaleDateString. */
export function monthTitle(year: number, month: number, language: 'es' | 'en'): string {
  const formatted = new Intl.DateTimeFormat(language, {
    month: 'long',
    year: 'numeric',
  }).format(new Date(year, month, 1));
  return formatted.charAt(0).toUpperCase() + formatted.slice(1);
}
