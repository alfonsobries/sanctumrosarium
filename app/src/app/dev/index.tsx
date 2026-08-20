import { Stack, useRouter } from 'expo-router';

import { Card } from '@/components/Card';
import { ListRow } from '@/components/ListRow';
import { Screen } from '@/components/Screen';

const sections = [
  { href: '/dev/colors', label: 'Colores' },
  { href: '/dev/typography', label: 'Tipografía' },
  { href: '/dev/components', label: 'Componentes' },
  { href: '/dev/controls', label: 'Controles nativos' },
] as const;

export default function DevIndexScreen() {
  const router = useRouter();

  return (
    <Screen edges={['bottom', 'left', 'right']}>
      <Stack.Screen options={{ title: 'Galería de UI' }} />
      <Card>
        {sections.map((section, index) => (
          <ListRow
            key={section.href}
            label={section.label}
            divider={index < sections.length - 1}
            onPress={() => router.push(section.href)}
          />
        ))}
      </Card>
    </Screen>
  );
}
