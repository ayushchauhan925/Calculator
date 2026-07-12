import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useCalculator } from '@/store/useCalculator';
import { useTheme } from '@/store/useSettings';
import { layout } from '@/theme/layout';

export function Display() {
  const t = useTheme();
  const expression = useCalculator((s) => s.expression);
  const preview = useCalculator((s) => s.preview);
  const error = useCalculator((s) => s.error);

  return (
    <View style={styles.wrap}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        <Text style={[styles.expression, { color: t.textHi }]} numberOfLines={1}>
          {expression || '0'}
        </Text>
      </ScrollView>

      <Text style={[styles.preview, { color: error ? t.textErr : t.textLo }]}>
        {error ?? (preview !== null ? String(preview) : '')}
      </Text>

      <View style={[styles.rule, { backgroundColor: t.rule }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingHorizontal: layout.padding + 4,
    paddingBottom: 14,
  },
  scroll: { flexGrow: 1, justifyContent: 'flex-end', alignItems: 'center' },
  expression: {
    fontSize: layout.displayFont,
    fontWeight: '300',
    letterSpacing: -1.5,
    fontVariant: ['tabular-nums'],
    paddingRight: 3,
  },
  preview: {
    fontSize: layout.previewFont,
    fontWeight: '300',
    textAlign: 'right',
    marginTop: 10,
    minHeight: 30,
    fontVariant: ['tabular-nums'],
    paddingRight: 3,
  },
  rule: {
    height: StyleSheet.hairlineWidth,
    marginTop: 20,
    marginHorizontal: 4,
  },
});