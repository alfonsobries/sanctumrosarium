import { describe, expect, it } from 'vitest';

import { monthGrid, monthRange, weekOf } from './dates';

describe('dates', () => {
  it('builds a Monday-first week', () => {
    expect(weekOf({ year: 2026, month: 10, day: 8 }).map((d) => d.day)).toEqual([5, 6, 7, 8, 9, 10, 11]);
  });

  it('crosses month boundaries', () => {
    expect(weekOf({ year: 2026, month: 11, day: 1 })[0]).toEqual({ year: 2026, month: 10, day: 26 });
  });

  it('pads a month grid to start on Monday', () => {
    const grid = monthGrid(2026, 10);
    expect(grid.slice(0, 3)).toEqual([null, null, null]);
    expect(grid[3]).toEqual({ year: 2026, month: 10, day: 1 });
    expect(grid).toHaveLength(3 + 31);
  });

  it('knows leap years', () => {
    expect(monthRange(2028, 2).days).toBe(29);
  });
});
