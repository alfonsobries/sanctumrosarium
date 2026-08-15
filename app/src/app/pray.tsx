import {
  buildRosary,
  mysteriesOfDay,
  advance,
  goBack,
  progressOf,
  startSession,
} from '@rosario/engine';
import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useTheme } from '@/theme/use-theme';

export default function PrayScreen() {
  const colors = useTheme();
  const router = useRouter();

  const steps = useMemo(() => {
    const today = mysteriesOfDay(new Date());
    return buildRosary({ form: 'es-MX', locale: 'es-MX', set: today.set });
  }, []);

  const [session, setSession] = useState(() => startSession(new Date()));
  const progress = progressOf(session, steps);
  const step = steps[progress.stepIndex];

  if (step === undefined) {
    return (
      <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
        <View style={styles.container}>
          <Text style={[styles.title, { color: colors.text }]}>Cinco decenas.</Text>
          <Pressable onPress={() => router.back()}>
            <Text style={[styles.action, { color: colors.accent }]}>Terminar</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  // The mystery is on every step of a decade: the bead count never shows without it.
  const mystery = 'mystery' in step ? step.mystery : undefined;

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <Pressable
        style={styles.container}
        onPress={() => setSession(advance(session, steps, new Date()))}
      >
        {mystery === undefined ? null : (
          <Text style={[styles.mystery, { color: colors.textMuted }]}>
            {mystery.text.es.title}
          </Text>
        )}

        {step.kind === 'prayer' ? (
          <View style={styles.lines}>
            {step.prayer.lines.map((line, index) => (
              <Text key={line} style={[styles.line, { color: colors.text }]}>
                {line}
              </Text>
            ))}
          </View>
        ) : null}

        {step.kind === 'announce' ? (
          <Text style={[styles.title, { color: colors.text }]}>
            {step.mystery.text.es.title}
          </Text>
        ) : null}

        <Text style={[styles.beads, { color: colors.textMuted }]}>
          {progress.beadInDecade === undefined
            ? ''
            : `${progress.beadInDecade} de 10 - decena ${(progress.decade ?? 0) + 1}`}
        </Text>

        <Pressable onPress={() => setSession(goBack(session))} hitSlop={16}>
          <Text style={[styles.action, { color: colors.textMuted }]}>Atrás</Text>
        </Pressable>
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  container: { flex: 1, justifyContent: 'center', paddingHorizontal: 28, gap: 16 },
  mystery: { fontSize: 15, letterSpacing: 0.4 },
  title: { fontSize: 26, fontWeight: '600', lineHeight: 34 },
  lines: { gap: 4 },
  line: { fontSize: 21, lineHeight: 30 },
  beads: { fontSize: 15, marginTop: 8 },
  action: { fontSize: 16, marginTop: 24 },
});
