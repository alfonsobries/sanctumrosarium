import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/AppText';
import { Card } from '@/components/Card';
import { Screen } from '@/components/Screen';
import { SectionHeader } from '@/components/SectionHeader';
import { appJournal } from '@/features/journal/app-journal';
import { spacing, touchTarget } from '@/theme/tokens';
import { useTheme } from '@/theme/use-theme';

/**
 * For whom this person has prayed, and how many times. Never whether it was answered:
 * a register of answered prayers turns prayer into a transaction
 * (docs/gamificacion.md, 5). Everything here stays on the device.
 */
export default function IntentionsScreen() {
  const { t } = useTranslation();
  const colors = useTheme();
  const [state, setState] = useState(() => ({
    saved: appJournal.savedIntentions(),
    history: appJournal.intentionHistory(),
  }));

  useFocusEffect(
    useCallback(() => {
      setState({
        saved: appJournal.savedIntentions(),
        history: appJournal.intentionHistory(),
      });
    }, []),
  );

  const handleDelete = (intention: string) => {
    appJournal.deleteIntention(intention);
    setState((current) => ({
      ...current,
      saved: current.saved.filter((other) => other !== intention),
    }));
  };

  if (state.saved.length === 0 && state.history.length === 0) {
    return (
      <Screen center edges={['bottom', 'left', 'right']}>
        <AppText variant="body" color="muted">
          {t('intentions.empty')}
        </AppText>
      </Screen>
    );
  }

  return (
    <Screen edges={['bottom', 'left', 'right']}>
      {state.saved.length === 0 ? null : (
        <>
          <SectionHeader title={t('intentions.saved')} />
          <Card>
            {state.saved.map((intention, index) => (
              <View
                key={intention}
                style={[
                  styles.row,
                  index < state.saved.length - 1 && {
                    borderBottomWidth: StyleSheet.hairlineWidth,
                    borderBottomColor: colors.border,
                  },
                ]}
              >
                <AppText variant="body" style={styles.rowText}>
                  {intention}
                </AppText>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={`${t('intentions.delete')}: ${intention}`}
                  hitSlop={12}
                  onPress={() => handleDelete(intention)}
                  style={({ pressed }) => [styles.delete, pressed && styles.pressed]}
                >
                  <AppText variant="caption" color="muted">
                    {t('intentions.delete')}
                  </AppText>
                </Pressable>
              </View>
            ))}
          </Card>
        </>
      )}

      {state.history.length === 0 ? null : (
        <>
          <SectionHeader title={t('intentions.history')} />
          <Card>
            {state.history.map((entry, index) => (
              <View
                key={entry.intention}
                style={[
                  styles.row,
                  index < state.history.length - 1 && {
                    borderBottomWidth: StyleSheet.hairlineWidth,
                    borderBottomColor: colors.border,
                  },
                ]}
              >
                <AppText variant="body" style={styles.rowText}>
                  {entry.intention}
                </AppText>
                <AppText variant="caption" color="muted">
                  {t('intentions.times', { count: entry.times })}
                </AppText>
              </View>
            ))}
          </Card>
        </>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  row: {
    minHeight: touchTarget,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.sm,
  },
  rowText: { flex: 1 },
  delete: { minHeight: touchTarget, justifyContent: 'center' },
  pressed: { opacity: 0.6 },
});
