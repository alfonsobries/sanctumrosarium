/** Uppercases only the first letter, as Spanish dates and month names are written at the start of a line. */
export function capitalizeFirst(value: string): string {
  return value.charAt(0).toLocaleUpperCase() + value.slice(1);
}
