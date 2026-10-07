import { View } from 'react-native';

import type { BeadRingState } from './BeadRing';

type BeadRowProperties = {
  state: BeadRingState;
  colors: { done: string; pending: string; current: string };
};

/** The beads of the current decade (or of the opening) laid out in a line, for the title bar. */
export function BeadRow({ state, colors }: BeadRowProperties) {
  const beads: { key: string; size: number; done: boolean; current: boolean }[] = [];
  if (state.kind === 'opening') {
    [0, 1, 2, 3, 4].forEach((position) => {
      beads.push({
        key: `o${position}`,
        size: position <= 1 ? 7 : 5,
        done: position < state.prayed || (position === 0 && state.prayed > 0),
        current: state.current === position,
      });
    });
  } else {
    beads.push({
      key: 'of',
      size: 7,
      done: state.ourFather === 'done',
      current: state.ourFather === 'current',
    });
    for (let index = 1; index <= 10; index++) {
      beads.push({
        key: `h${index}`,
        size: 5,
        done: index <= state.prayed,
        current: state.current === index,
      });
    }
  }

  return (
    <View accessible={false} className="flex-row items-center gap-[5px]">
      {beads.map((bead, index) => (
        <View
          key={bead.key}
          style={{
            width: bead.current ? bead.size + 3 : bead.size,
            height: bead.current ? bead.size + 3 : bead.size,
            borderRadius: 99,
            marginRight: index === 0 && state.kind === 'decade' ? 4 : 0,
            backgroundColor: bead.current ? colors.current : bead.done ? colors.done : colors.pending,
          }}
        />
      ))}
    </View>
  );
}
