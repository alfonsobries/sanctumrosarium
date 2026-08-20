import { Stack } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/AppText';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { ListRow } from '@/components/ListRow';
import { Screen } from '@/components/Screen';
import { SectionHeader } from '@/components/SectionHeader';
import { spacing } from '@/theme/tokens';

export default function DevComponentsScreen() {
  const [selected, setSelected] = useState('uno');

  return (
    <Screen edges={['bottom', 'left', 'right']}>
      <Stack.Screen options={{ title: 'Componentes' }} />

      <SectionHeader title="Button" />
      <View style={styles.column}>
        <Button label="Primario" onPress={() => {}} />
        <Button label="Secundario" variant="secondary" onPress={() => {}} />
        <Button label="Fantasma" variant="ghost" onPress={() => {}} />
        <Button label="Deshabilitado" disabled onPress={() => {}} />
      </View>

      <SectionHeader title="Card + ListRow" />
      <Card>
        {(['uno', 'dos', 'tres'] as const).map((option, index) => (
          <ListRow
            key={option}
            label={`Opción ${option}`}
            selected={selected === option}
            divider={index < 2}
            onPress={() => setSelected(option)}
          />
        ))}
      </Card>

      <SectionHeader title="ListRow con valor" />
      <Card>
        <ListRow label="Idioma" value="Español" onPress={() => {}} />
        <ListRow label="Sin acción" value="Estático" divider={false} />
      </Card>

      <SectionHeader title="Card de texto" />
      <Card>
        <AppText variant="heading">La Anunciación</AppText>
        <AppText variant="bodySerif" color="secondary" style={styles.cardBody}>
          El ángel del Señor anunció a María, y concibió por obra del Espíritu Santo.
        </AppText>
        <AppText variant="caption" color="muted" style={styles.cardBody}>
          Lc 1, 26-38
        </AppText>
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  column: { gap: spacing.sm },
  cardBody: { marginTop: spacing.sm },
});
