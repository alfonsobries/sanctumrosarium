import { Link } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { reasonFor, setNames } from '@/features/rosary/labels';
import { useToday } from '@/features/rosary/use-today';
import { useTheme } from '@/theme/use-theme';

export default function HomeScreen() {
  const colors = useTheme();
  const today = useToday();

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <View style={styles.container}>
        <Text style={[styles.set, { color: colors.text }]}>{setNames[today.set]}</Text>
        <Text style={[styles.reason, { color: colors.textMuted }]}>
          {reasonFor(today)}
        </Text>

        <View style={styles.mysteries}>
          {today.mysteries.map((mystery) => (
            <Text key={mystery.id} style={[styles.mystery, { color: colors.textMuted }]}>
              {mystery.text.es.title}
            </Text>
          ))}
        </View>

        <Link href="/pray" style={[styles.start, { color: colors.accent }]}>
          Empezar
        </Link>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  container: { flex: 1, justifyContent: 'center', paddingHorizontal: 28, gap: 12 },
  set: { fontSize: 30, fontWeight: '600' },
  reason: { fontSize: 16, lineHeight: 22 },
  mysteries: { gap: 6, marginTop: 20 },
  mystery: { fontSize: 16, lineHeight: 22 },
  start: { fontSize: 20, fontWeight: '600', marginTop: 32 },
});
