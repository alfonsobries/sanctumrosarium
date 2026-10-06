import {
  ArrowRight01Icon,
  BookOpen01Icon,
  Calendar03Icon,
  Cancel01Icon,
  MoreHorizontalIcon,
  NextIcon,
  PauseIcon,
  PlayIcon,
  PreviousIcon,
  Settings02Icon,
  TextFontIcon,
  Tick02Icon,
  TouchInteraction01Icon,
  VolumeHighIcon,
} from '@hugeicons/core-free-icons';
import { HugeiconsIcon, type IconSvgElement } from '@hugeicons/react-native';

import { DecadeIcon, LatinCrossIcon, RosaryIcon } from './custom-icons';

const icons = {
  chevron: ArrowRight01Icon,
  settings: Settings02Icon,
  play: PlayIcon,
  pause: PauseIcon,
  next: NextIcon,
  previous: PreviousIcon,
  close: Cancel01Icon,
  calendar: Calendar03Icon,
  more: MoreHorizontalIcon,
  text: TextFontIcon,
  check: Tick02Icon,
  listen: VolumeHighIcon,
  tap: TouchInteraction01Icon,
  learn: BookOpen01Icon,
  cross: LatinCrossIcon,
  rosary: RosaryIcon,
  decade: DecadeIcon,
} satisfies Record<string, IconSvgElement>;

export type IconName = keyof typeof icons;

type IconProperties = {
  name: IconName;
  size?: number;
  color: string;
  strokeWidth?: number;
};

export function Icon({ name, size = 22, color, strokeWidth = 1.5 }: IconProperties) {
  return <HugeiconsIcon icon={icons[name]} size={size} color={color} strokeWidth={strokeWidth} />;
}
