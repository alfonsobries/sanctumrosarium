import Svg, { Circle, Line, Path } from 'react-native-svg';

import { useSkin } from '@/shared/theme/SkinProvider';

import { crossPath, placesFor, type BeadState } from './bead-places';

type BeadRowProperties = {
  state: BeadState;
  /** Drawn larger for illustrations; the folded controls use 1. */
  scale?: number;
};

const small = 3;
const large = 4.5;
const step = 11;
const height = 22;

/** The beads of the current decade (or the opening) strung in a line, for the folded controls. */
export function BeadRow({ state, scale = 1 }: BeadRowProperties) {
  const { colors } = useSkin();
  const places = placesFor(state);
  const xs: number[] = [];
  let x = 6;
  places.forEach((place, index) => {
    // The Our Father bead stands a little apart from the Hail Marys, as on the cord.
    if (index > 0 && (places[index - 1]?.shape !== 'small' || place.shape !== 'small')) {
      x += 4;
    }
    xs.push(x);
    x += step;
  });
  const width = x - step + 6;
  const y = height / 2;

  return (
    <Svg accessible={false} width={width * scale} height={height * scale} viewBox={`0 0 ${width} ${height}`}>
      <Line
        x1={xs[0]}
        y1={y}
        x2={xs.at(-1)}
        y2={y}
        stroke={colors.faint}
        strokeOpacity={0.55}
        strokeWidth={1}
      />
      {places.map((place, index) => {
        const cx = xs[index] ?? 0;
        const color = place.current ? colors.accent : place.done ? colors['bead-done'] : colors.bead;
        if (place.shape === 'cross') {
          return (
            <Path
              key={place.key}
              d={crossPath(cx, y, 12)}
              stroke={place.current ? colors.accent : place.done ? colors['bead-done'] : colors.muted}
              strokeWidth={1.75}
              strokeLinecap="round"
            />
          );
        }
        const r = (place.shape === 'large' ? large : small) + (place.current ? 1 : 0);
        return (
          <Circle
            key={place.key}
            cx={cx}
            cy={y}
            r={r}
            fill={color}
            stroke={place.current ? colors.accent : undefined}
            strokeOpacity={0.35}
            strokeWidth={place.current ? 5 : 0}
          />
        );
      })}
    </Svg>
  );
}
