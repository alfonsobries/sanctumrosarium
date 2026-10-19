/** Uppercases only the first letter, as Spanish dates and month names are written at the start of a line. */
export function capitalizeFirst(value: string): string {
  return value.charAt(0).toLocaleUpperCase() + value.slice(1);
}

/** A time of day in the reader's convention: "8:00 p.m." in Mexico, "8:00 PM" in English. */
export function formatTime(date: Date, language: string): string {
  return new Intl.DateTimeFormat(language, { hour: 'numeric', minute: '2-digit' }).format(date);
}
