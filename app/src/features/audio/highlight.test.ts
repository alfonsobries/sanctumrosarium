import { describe, expect, it } from 'vitest';

import { activeLineAt } from './highlight';

const lines = [
  { startMs: 500, endMs: 2000 },
  { startMs: 2400, endMs: 4000 },
  { startMs: 4100, endMs: 6000 },
];

describe('activeLineAt', () => {
  it('lights nothing before the first line is said', () => {
    expect(activeLineAt(lines, 0)).toBeUndefined();
    expect(activeLineAt(lines, 499)).toBeUndefined();
  });

  it('follows the line being said', () => {
    expect(activeLineAt(lines, 500)).toBe(0);
    expect(activeLineAt(lines, 3000)).toBe(1);
    expect(activeLineAt(lines, 4100)).toBe(2);
  });

  it('holds the previous line through the pause between lines', () => {
    expect(activeLineAt(lines, 2200)).toBe(0);
  });

  it('keeps the last line lit after it ends', () => {
    expect(activeLineAt(lines, 9000)).toBe(2);
  });

  it('shows no highlight without marks', () => {
    expect(activeLineAt(undefined, 1000)).toBeUndefined();
    expect(activeLineAt([], 1000)).toBeUndefined();
  });
});
