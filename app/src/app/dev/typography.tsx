import { Stack } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/AppText';
import { Screen } from '@/components/Screen';
import { spacing } from '@/theme/tokens';
import { typeScale, type TypeVariant } from '@/theme/typography';

const samples: Record<TypeVariant, string> = {
  display: 'Misterios gloriosos',
  title: 'La Resurrección del Señor',
  heading: 'Primer misterio',
  prayer: 'Dios te salve, María, llena eres de gracia.',
  body: 'El idioma del rezo se elige aparte del idioma de la app.',
  bodySerif: 'La contemplación de los misterios acompaña cada decena.',
  label: 'Empezar',
  caption: 'Fuente: USCCB, How to Pray the Rosary',
  overline: 'Segunda decena',
};

export default function DevTypographyScreen() {
  return (
    <Screen edges={['bottom', 'left', 'right']}>
      <Stack.Screen options={{ title: 'Tipografía' }} />
      <View style={styles.list}>
        {(Object.keys(samples) as TypeVariant[]).map((variant) => (
          <View key={variant} style={styles.entry}>
            <AppText variant="caption" color="muted">
              {variant} · {typeScale[variant].fontSize}/{typeScale[variant].lineHeight}
            </AppText>
            <AppText variant={variant}>{samples[variant]}</AppText>
          </View>
        ))}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  list: { gap: spacing.lg },
  entry: { gap: spacing.xs },
});
