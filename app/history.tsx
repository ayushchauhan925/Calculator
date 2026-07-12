import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';
import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import { useMemo } from 'react';
import { Alert, Pressable, SectionList, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useCalculator } from '@/store/useCalculator';
import { useHistory, type HistoryEntry } from '@/store/useHistory';
import { useSettings, useTheme } from '@/store/useSettings';
import { type Theme } from '@/theme/themes';

/* ------------------------------------------------------------------ */
/* Group entries into Today / Yesterday / a date                       */
/* ------------------------------------------------------------------ */

function dayKey(ts: number): string {
  const d = new Date(ts);
  const today = new Date();
  const yesterday = new Date(Date.now() - 86_400_000);

  const same = (a: Date, b: Date) =>
    a.getDate() === b.getDate() &&
    a.getMonth() === b.getMonth() &&
    a.getFullYear() === b.getFullYear();

  if (same(d, today)) return 'TODAY';
  if (same(d, yesterday)) return 'YESTERDAY';
  return d
    .toLocaleDateString(undefined, { day: 'numeric', month: 'short' })
    .toUpperCase();
}

function timeOf(ts: number): string {
  return new Date(ts).toLocaleTimeString(undefined, {
    hour: 'numeric',
    minute: '2-digit',
  });
}

/* ------------------------------------------------------------------ */

export default function History() {
  const t = useTheme();
  const entries = useHistory((s) => s.entries);
  const clear = useHistory((s) => s.clear);
  const remove = useHistory((s) => s.remove);
  const setExpression = useCalculator((s) => s.setExpression);
  const hapticsOn = useSettings((s) => s.haptics);

  const sections = useMemo(() => {
    const map = new Map<string, HistoryEntry[]>();
    for (const e of entries) {
      const k = dayKey(e.at);
      if (!map.has(k)) map.set(k, []);
      map.get(k)!.push(e);
    }
    return Array.from(map, ([title, data]) => ({ title, data }));
  }, [entries]);

  const tap = (fn: () => void) => {
    if (hapticsOn) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    fn();
  };

  /** Tap the expression → load it back into the calculator for editing. */
  const editExpression = (e: HistoryEntry) =>
    tap(() => {
      setExpression(e.expression);
      router.back();
    });

  /** Tap the result → append that number to whatever you're typing. */
  const appendResult = (e: HistoryEntry) =>
    tap(() => {
      const current = useCalculator.getState().expression;
      setExpression(current + e.result);
      router.back();
    });

  /** Long-press → copy the result. */
  const copyResult = (e: HistoryEntry) => {
    if (hapticsOn) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Clipboard.setStringAsync(e.result);
  };

  const confirmClear = () =>
    Alert.alert('Clear history?', 'This removes every saved calculation.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Clear', style: 'destructive', onPress: () => clear() },
    ]);

  return (
    <SafeAreaView style={[s.fill, { backgroundColor: t.shell }]} edges={['top', 'bottom']}>
      {/* ---------------- masthead ---------------- */}
      <View style={s.header}>
        <View style={s.headerLeft}>
          <Text style={[s.title, { color: t.textHi }]}>History</Text>
          <View style={s.titleRule}>
            <View style={[s.titleRuleAccent, { backgroundColor: t.accent }]} />
            <View style={[s.titleRuleRest, { backgroundColor: t.rule }]} />
          </View>
        </View>

        <View style={s.headerActions}>
          {entries.length > 0 && (
            <Pressable
              onPress={confirmClear}
              hitSlop={12}
              style={({ pressed }) => [
                s.iconBtn,
                { borderColor: t.rule, opacity: pressed ? 0.5 : 1 },
              ]}
            >
              <MaterialCommunityIcons name="trash-can-outline" size={17} color={t.textLo} />
            </Pressable>
          )}
          <Pressable
            onPress={() => router.back()}
            hitSlop={12}
            style={({ pressed }) => [
              s.iconBtn,
              { borderColor: t.rule, opacity: pressed ? 0.5 : 1 },
            ]}
          >
            <MaterialCommunityIcons name="close" size={18} color={t.textLo} />
          </Pressable>
        </View>
      </View>

      {entries.length === 0 ? (
        <Empty t={t} />
      ) : (
        <SectionList
          sections={sections}
          keyExtractor={(e) => e.id}
          contentContainerStyle={s.list}
          showsVerticalScrollIndicator={false}
          stickySectionHeadersEnabled={false}
          renderSectionHeader={({ section }) => (
            <View style={s.sectionHead}>
              <Text style={[s.sectionTitle, { color: t.textLo }]}>{section.title}</Text>
              <View style={[s.sectionRule, { backgroundColor: t.rule }]} />
            </View>
          )}
          renderItem={({ item }) => (
            <Entry
              t={t}
              e={item}
              onEdit={() => editExpression(item)}
              onAppend={() => appendResult(item)}
              onCopy={() => copyResult(item)}
              onDelete={() => remove(item.id)}
            />
          )}
        />
      )}

      {entries.length > 0 && (
        <Text style={[s.hint, { color: t.textLo }]}>
          Tap an expression to edit it · tap a result to use it
        </Text>
      )}
    </SafeAreaView>
  );
}

/* ------------------------------------------------------------------ */

function Entry({
  t, e, onEdit, onAppend, onCopy, onDelete,
}: {
  t: Theme;
  e: HistoryEntry;
  onEdit: () => void;
  onAppend: () => void;
  onCopy: () => void;
  onDelete: () => void;
}) {
  return (
    <View style={[s.entry, { borderColor: t.rule, backgroundColor: t.surface }]}>
      {/* expression — tappable, loads back into the calculator */}
      <Pressable
        onPress={onEdit}
        style={({ pressed }) => [s.exprRow, { opacity: pressed ? 0.55 : 1 }]}
      >
        <Text style={[s.expr, { color: t.textLo }]} numberOfLines={2}>
          {e.expression}
        </Text>
        <MaterialCommunityIcons name="pencil-outline" size={14} color={t.textLo} />
      </Pressable>

      {/* result — tappable, appends to the current expression */}
      <Pressable
        onPress={onAppend}
        onLongPress={onCopy}
        delayLongPress={350}
        style={({ pressed }) => [s.resultRow, { opacity: pressed ? 0.55 : 1 }]}
      >
        <Text style={[s.eq, { color: t.accent }]}>=</Text>
        <Text style={[s.result, { color: t.textHi }]} numberOfLines={1}>
          {e.result}
        </Text>
      </Pressable>

      {/* footer: time + delete */}
      <View style={[s.entryFoot, { borderTopColor: t.rule }]}>
        <Text style={[s.time, { color: t.textLo }]}>{timeOf(e.at)}</Text>
        <Pressable
          onPress={onDelete}
          hitSlop={10}
          style={({ pressed }) => ({ opacity: pressed ? 0.4 : 0.7 })}
        >
          <MaterialCommunityIcons name="close" size={15} color={t.textLo} />
        </Pressable>
      </View>
    </View>
  );
}

function Empty({ t }: { t: Theme }) {
  return (
    <View style={s.empty}>
      <View style={[s.emptyMark, { borderColor: t.rule }]}>
        <MaterialCommunityIcons name="history" size={26} color={t.textLo} />
      </View>
      <Text style={[s.emptyTitle, { color: t.textHi }]}>Nothing here yet</Text>
      <Text style={[s.emptyBody, { color: t.textLo }]}>
        Calculations you finish will{'\n'}appear here, ready to reuse.
      </Text>
    </View>
  );
}

/* ------------------------------------------------------------------ */

const s = StyleSheet.create({
  fill: { flex: 1 },

  /* masthead */
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingHorizontal: 22,
    paddingTop: 12,
    marginBottom: 6,
  },
  headerLeft: { flex: 1 },
  title: { fontSize: 38, fontWeight: '200', letterSpacing: -1.2, lineHeight: 44 },
  titleRule: { flexDirection: 'row', marginTop: 16, height: 2 },
  titleRuleAccent: { width: 32, height: 2 },
  titleRuleRest: { flex: 1, height: StyleSheet.hairlineWidth, alignSelf: 'center' },
  headerActions: { flexDirection: 'row', gap: 8, marginTop: 2 },
  iconBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: StyleSheet.hairlineWidth * 2,
    alignItems: 'center',
    justifyContent: 'center',
  },

  /* list */
  list: { paddingHorizontal: 22, paddingTop: 20, paddingBottom: 20 },

  sectionHead: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 22,
    marginBottom: 12,
  },
  sectionTitle: { fontSize: 11, letterSpacing: 2 },
  sectionRule: { flex: 1, height: StyleSheet.hairlineWidth },

  /* entry card */
  entry: {
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingTop: 14,
    marginBottom: 10,
  },
  exprRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  expr: {
    flex: 1,
    fontSize: 15,
    fontWeight: '300',
    fontVariant: ['tabular-nums'],
    lineHeight: 22,
  },
  resultRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 10,
    marginTop: 6,
    marginBottom: 12,
  },
  eq: { fontSize: 20, fontWeight: '200' },
  result: {
    flex: 1,
    fontSize: 30,
    fontWeight: '200',
    letterSpacing: -0.8,
    fontVariant: ['tabular-nums'],
  },
  entryFoot: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 9,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  time: { fontSize: 11, letterSpacing: 0.4, fontVariant: ['tabular-nums'] },

  /* empty */
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingBottom: 60 },
  emptyMark: {
    width: 66,
    height: 66,
    borderRadius: 33,
    borderWidth: StyleSheet.hairlineWidth * 3,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 22,
  },
  emptyTitle: { fontSize: 20, fontWeight: '300', marginBottom: 8 },
  emptyBody: { fontSize: 14, lineHeight: 22, textAlign: 'center', fontWeight: '300' },

  /* hint */
  hint: {
    fontSize: 11,
    textAlign: 'center',
    paddingBottom: 10,
    paddingTop: 4,
    letterSpacing: 0.2,
  },
});