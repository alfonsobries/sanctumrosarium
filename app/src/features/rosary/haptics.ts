import * as Haptics from 'expo-haptics';

import type { HapticsSetting } from '@/settings/store';

import type { HapticPattern } from './haptic-patterns';

const pause = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function playHaptic(
  pattern: HapticPattern,
  setting: HapticsSetting,
): Promise<void> {
  if (setting === 'off' || pattern === 'none') {
    return;
  }
  const strong = setting === 'strong';
  switch (pattern) {
    case 'bead':
      await (strong
        ? Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
        : Haptics.selectionAsync());
      return;
    case 'pater':
      await Haptics.impactAsync(
        strong ? Haptics.ImpactFeedbackStyle.Heavy : Haptics.ImpactFeedbackStyle.Medium,
      );
      await pause(140);
      await Haptics.impactAsync(
        strong ? Haptics.ImpactFeedbackStyle.Heavy : Haptics.ImpactFeedbackStyle.Medium,
      );
      return;
    case 'gloria':
      await Haptics.impactAsync(
        strong ? Haptics.ImpactFeedbackStyle.Heavy : Haptics.ImpactFeedbackStyle.Medium,
      );
      await pause(120);
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      return;
    case 'announce':
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      return;
  }
}
