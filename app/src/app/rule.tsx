import { StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';

import { AppText } from '@/components/AppText';
import { Card } from '@/components/Card';
import { ListRow } from '@/components/ListRow';
import { Screen } from '@/components/Screen';
import type { RuleId } from '@/features/journal/rule';
import { useSettings } from '@/settings/settings-context';
import { spacing } from '@/theme/tokens';

/**
 * No rule goes first and nothing is ranked or recommended: the options are ways of
 * praying, not levels (docs/gamificacion.md, 1). Lowering or removing takes one tap,
 * with no confirmation and no question why.
 */
const options: readonly RuleId[] = [
  'none',
  'daily-decade',
  'daily-rosary',
  'weekly-fifteen',
  'full-rosary',
];

export default function RuleScreen() {
  const { t } = useTranslation();
  const { settings, setRule } = useSettings();

  return (
    <Screen edges={['bottom', 'left', 'right']}>
      <Card style={styles.card}>
        {options.map((option, index) => (
          <ListRow
            key={option}
            label={t(`rule.names.${option}`)}
            selected={settings.rule === option}
            divider={index < options.length - 1}
            onPress={() => setRule(option)}
          />
        ))}
      </Card>
      <AppText variant="caption" color="muted" style={styles.line}>
        {t(`rule.lines.${settings.rule}`)}
      </AppText>
      {settings.rule === 'weekly-fifteen' ? (
        <AppText variant="caption" color="muted" style={styles.line}>
          {t('rule.confraternity')}
        </AppText>
      ) : null}
      <AppText variant="caption" color="muted" style={styles.line}>
        {t('rule.footer')}
      </AppText>
    </Screen>
  );
}

const styles = StyleSheet.create({
  card: { marginTop: spacing.md },
  line: { marginTop: spacing.md, paddingHorizontal: spacing.xs },
});
