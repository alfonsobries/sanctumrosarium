export type BeadState =
  | { kind: 'decade'; ourFather: 'pending' | 'current' | 'done'; prayed: number; current: number | null }
  /** Positions: 0 the cross, 1 the Our Father bead, 2-4 the three Hail Marys. */
  | { kind: 'opening'; prayed: number; current: number | null };

export type Shape = 'cross' | 'large' | 'small';

export type Place = {
  key: string;
  shape: Shape;
  done: boolean;
  current: boolean;
};

/** The beads of the current decade, or the crucifix and the four beads of the opening. */
export function placesFor(state: BeadState): Place[] {
  if (state.kind === 'opening') {
    return [0, 1, 2, 3, 4].map((position) => ({
      key: `o${position}`,
      shape: position === 0 ? 'cross' : position === 1 ? 'large' : 'small',
      done: position === 0 ? state.current !== 0 : position <= state.prayed,
      current: state.current === position,
    }));
  }
  return Array.from({ length: 11 }, (_, index) => ({
    key: index === 0 ? 'of' : `hm${index}`,
    shape: index === 0 ? 'large' : 'small',
    done: index === 0 ? state.ourFather === 'done' : index <= state.prayed,
    current: index === 0 ? state.ourFather === 'current' : state.current === index,
  }));
}

/** A Latin cross centred on (x, y), drawn with the same round stroke as the icons. */
export function crossPath(x: number, y: number, height: number): string {
  const top = y - height / 2;
  const arm = height * 0.32;
  const beam = top + height * 0.3;
  return `M${x} ${top} V${top + height} M${x - arm} ${beam} H${x + arm}`;
}
