import { SymbolView } from 'expo-symbols';

const symbols = {
  chevron: { ios: 'chevron.right', android: 'chevron_right' },
  settings: { ios: 'gearshape', android: 'settings' },
  play: { ios: 'play.fill', android: 'play_arrow' },
  pause: { ios: 'pause.fill', android: 'pause' },
  next: { ios: 'forward.end.fill', android: 'skip_next' },
  previous: { ios: 'backward.end.fill', android: 'skip_previous' },
  close: { ios: 'xmark', android: 'close' },
  book: { ios: 'book.closed', android: 'menu_book' },
  calendar: { ios: 'calendar', android: 'calendar_month' },
  more: { ios: 'ellipsis', android: 'more_horiz' },
  text: { ios: 'textformat.size', android: 'text_fields' },
  check: { ios: 'checkmark', android: 'check' },
  listen: { ios: 'speaker.wave.2', android: 'volume_up' },
  tap: { ios: 'hand.tap', android: 'touch_app' },
  learn: { ios: 'book', android: 'auto_stories' },
} as const;

export type IconName = keyof typeof symbols;

type IconProperties = {
  name: IconName;
  size?: number;
  color: string;
  weight?: 'regular' | 'medium' | 'semibold';
};

export function Icon({ name, size = 20, color, weight = 'regular' }: IconProperties) {
  return <SymbolView name={symbols[name]} size={size} tintColor={color} weight={weight} />;
}
