import { lauretanae, type Language } from '@rosario/content';
import { Fragment } from 'react';
import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/AppText';
import { spacing } from '@/theme/tokens';

type LitanyViewProperties = {
  language: Language;
  /** When praying in Latin, the reader's own language runs under each invocation. */
  companion?: Exclude<Language, 'la'>;
};

/**
 * The Litany of Loreto, call and response, with the invocations of 1980, 1995 and 2020
 * in their place (the content package carries the order; a test guards it).
 */
export function LitanyView({ language, companion }: LitanyViewProperties) {
  const paired = companion !== undefined && companion !== language;

  const responseText = (line: (typeof lauretanae.lines)[number], lang: Language) =>
    line.response === 'repeat'
      ? line.call[lang]
      : lauretanae.responses[line.response][lang];

  return (
    <View style={styles.list}>
      {lauretanae.lines.map((line, index) => {
        const previous = lauretanae.lines[index - 1];
        const newGroup = previous === undefined || previous.group !== line.group;
        return (
          <Fragment key={line.id}>
            {newGroup && index > 0 ? <View style={styles.groupGap} /> : null}
            <View style={styles.line}>
              <AppText variant="bodySerif">{line.call[language]}</AppText>
              {paired ? (
                <AppText variant="caption" color="muted">
                  {line.call[companion]}
                </AppText>
              ) : null}
              <AppText variant="bodySerif" color="secondary" style={styles.response}>
                {responseText(line, language)}
              </AppText>
              {paired ? (
                <AppText variant="caption" color="muted" style={styles.response}>
                  {responseText(line, companion)}
                </AppText>
              ) : null}
            </View>
          </Fragment>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  list: { gap: spacing.md },
  line: { gap: spacing.xs },
  groupGap: { height: spacing.md },
  response: { fontStyle: 'italic' },
});
