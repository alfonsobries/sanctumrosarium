import Slider from '@react-native-community/slider';
import * as Haptics from 'expo-haptics';
import { Stack } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Switch,
  TextInput,
  View,
} from 'react-native';

import { AppText } from '@/components/AppText';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { Screen } from '@/components/Screen';
import { SectionHeader } from '@/components/SectionHeader';
import { radius, spacing, touchTarget } from '@/theme/tokens';
import { useTheme } from '@/theme/use-theme';
import { fonts, typeScale } from '@/theme/typography';

export default function DevControlsScreen() {
  const colors = useTheme();
  const [enabled, setEnabled] = useState(true);
  const [volume, setVolume] = useState(0.6);
  const [text, setText] = useState('');

  return (
    <Screen edges={['bottom', 'left', 'right']}>
      <Stack.Screen options={{ title: 'Controles nativos' }} />

      <SectionHeader title="Switch" />
      <Card style={styles.row}>
        <AppText style={styles.rowLabel}>Háptica</AppText>
        <Switch
          value={enabled}
          onValueChange={setEnabled}
          trackColor={{ false: colors.border, true: colors.accentSoft }}
          thumbColor={enabled ? colors.accent : undefined}
        />
      </Card>

      <SectionHeader title="Slider" />
      <Card>
        <AppText variant="caption" color="muted">
          Volumen · {Math.round(volume * 100)}%
        </AppText>
        <Slider
          value={volume}
          onValueChange={setVolume}
          minimumTrackTintColor={colors.accent}
          maximumTrackTintColor={colors.borderStrong}
          thumbTintColor={colors.accent}
        />
      </Card>

      <SectionHeader title="TextInput" />
      <Card>
        <TextInput
          value={text}
          onChangeText={setText}
          placeholder="Una intención"
          placeholderTextColor={colors.textMuted}
          style={[styles.input, { color: colors.text, borderColor: colors.borderStrong }]}
        />
      </Card>

      <SectionHeader title="ActivityIndicator" />
      <Card style={styles.row}>
        <ActivityIndicator color={colors.accent} />
        <ActivityIndicator size="large" color={colors.accent} />
      </Card>

      <SectionHeader title="Háptica" />
      <View style={styles.column}>
        <Button
          label="Impacto ligero"
          variant="secondary"
          onPress={() => void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
        />
        <Button
          label="Impacto medio"
          variant="secondary"
          onPress={() => void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)}
        />
        <Button
          label="Notificación"
          variant="secondary"
          onPress={() =>
            void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
          }
        />
      </View>

      <SectionHeader title="Alert" />
      <Button
        label="Mostrar alerta"
        variant="secondary"
        onPress={() => Alert.alert('Alerta nativa', 'Así se ve un diálogo del sistema.')}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  rowLabel: { flex: 1 },
  column: { gap: spacing.sm },
  // No lineHeight on TextInput: it mis-positions the text vertically on iOS.
  input: {
    borderWidth: 1,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    fontFamily: fonts.sans,
    fontSize: typeScale.body.fontSize,
    minHeight: touchTarget,
  },
});
