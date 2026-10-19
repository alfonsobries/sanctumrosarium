import {
  Bell,
  BookOpen,
  Clock,
  ExternalLink,
  Shield,
  BookOpenText,
  Church,
  Gauge,
  GraduationCap,
  Languages,
  List,
  Palette,
  ScrollText,
  SunMoon,
  Timer,
  CalendarDays,
  Check,
  ChevronLeft,
  ChevronRight,
  FileText,
  Globe,
  HandHeart,
  LifeBuoy,
  ShieldCheck,
  Ellipsis,
  Hand,
  Icon as LucideIcon,
  Pause,
  Play,
  Settings,
  SkipBack,
  SkipForward,
  Type,
  Volume2,
  X,
  type LucideIcon as LucideComponent,
  type IconNode,
} from 'lucide-react-native';

import { DecadeIcon, LatinCrossIcon, RosaryIcon } from './custom-icons';

const library = {
  chevron: ChevronRight,
  back: ChevronLeft,
  settings: Settings,
  play: Play,
  pause: Pause,
  next: SkipForward,
  previous: SkipBack,
  close: X,
  calendar: CalendarDays,
  more: Ellipsis,
  text: Type,
  check: Check,
  listen: Volume2,
  tap: Hand,
  learn: BookOpen,
  language: Languages,
  silence: Timer,
  speed: Gauge,
  gospel: BookOpenText,
  guided: GraduationCap,
  litany: List,
  pope: Church,
  skin: Palette,
  theme: SunMoon,
  prayer: ScrollText,
  website: Globe,
  support: LifeBuoy,
  privacy: ShieldCheck,
  terms: FileText,
  help: HandHeart,
  bell: Bell,
  time: Clock,
  external: ExternalLink,
  shield: Shield,
} satisfies Record<string, LucideComponent>;

const custom = {
  cross: LatinCrossIcon,
  rosary: RosaryIcon,
  decade: DecadeIcon,
} satisfies Record<string, IconNode>;

export type IconName = keyof typeof library | keyof typeof custom;

type IconProperties = {
  name: IconName;
  size?: number;
  color: string;
  strokeWidth?: number;
  /** Solid glyphs (play, pause) take the colour inside as well. */
  fill?: string;
};

export function Icon({ name, size = 22, color, strokeWidth = 1.75, fill }: IconProperties) {
  if (name in custom) {
    return (
      <LucideIcon
        iconNode={custom[name as keyof typeof custom]}
        size={size}
        color={color}
        strokeWidth={strokeWidth}
        fill={fill ?? 'none'}
      />
    );
  }
  const Component = library[name as keyof typeof library];
  return <Component size={size} color={color} strokeWidth={strokeWidth} fill={fill ?? 'none'} />;
}
