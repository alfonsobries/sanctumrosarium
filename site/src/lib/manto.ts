/**
 * The melody Fernando Ojeda Llanes reads from the stars and flowers of the image of Our
 * Lady of Guadalupe: "Prueba 2, registros centrales" (feet to head, central registers),
 * transcribed from the score in his book "Música en la Imagen Guadalupana", 2nd ed.,
 * p. 204. Every note is a quarter note at 75 bpm; the notes of a chord share a beat.
 * Bars 5 to 8 carry chords read from a scan and still need checking by ear against the
 * "Armonía Original" recording.
 */
export type Beat = readonly string[];

export const tempo = 75;

export const bars: readonly (readonly Beat[])[] = [
  [['C4'], ['F4'], ['C4'], ['E4']],
  [['E4'], ['A4'], ['D4'], ['D5']],
  [['B4'], ['C5'], ['F4'], ['F5']],
  [['F4'], ['A4', 'A5'], ['C5'], ['A4']],
  [['E4', 'A4'], ['D4', 'F4'], ['C5', 'A5'], ['D5', 'C6']],
  [['E5'], ['G4', 'A4', 'C5', 'F5'], ['D4', 'C5', 'B5'], ['F4', 'F5']],
  [['F4', 'F5'], ['G4'], ['B3', 'B4', 'B5'], ['G4', 'E5']],
  [['E5'], ['C4', 'G4', 'A4'], ['G4', 'A5'], ['C4']],
  [['C5'], ['A4'], ['F5'], ['A5']],
  [['D4', 'E4', 'C5'], ['G4'], ['B4'], ['D5']],
  [['F4', 'F5'], ['A4'], ['E4'], ['B4']],
];

/** Lowest and highest white keys the score reaches, as steps from middle C. */
export const range = { low: -1, high: 14 } as const;

const letters = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
const semitones = [0, 2, 4, 5, 7, 9, 11];

/** White-key steps from middle C: each line and each space of the grid is one key. */
export function stepOf(note: string): number {
  const letter = letters.indexOf(note[0] ?? '');
  const octave = Number(note.slice(1));
  return (octave - 4) * 7 + letter;
}

export function frequencyOf(note: string): number {
  const letter = letters.indexOf(note[0] ?? '');
  const octave = Number(note.slice(1));
  const midi = 12 * (octave + 1) + (semitones[letter] ?? 0);
  return 440 * 2 ** ((midi - 69) / 12);
}

export const beats: readonly Beat[] = bars.flat();
