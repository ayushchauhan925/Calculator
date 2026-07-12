import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Link, router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useCalculator } from '@/store/useCalculator';
import { useSettings, useTheme } from '@/store/useSettings';
import { themes, type Theme, type ThemeName } from '@/theme/themes';

/* ------------------------------------------------------------------ */
/* Theme preview — a miniature of the actual calculator                */
/* ------------------------------------------------------------------ */

function ThemePreview({ th, active, accent }: { th: Theme; active: boolean; accent: string }) {
  const r =
    th.keyShape === 'circle' ? 6 :
    th.keyShape === 'square' ? 0 : 3;

  const key = (fill: string, border: string) => ({
    width: 12,
    height: 12,
    borderRadius: r,
    backgroundColor: fill === 'transparent' ? 'transparent' : fill,
    borderColor: border === 'transparent' ? 'transparent' : border,
    borderWidth: border === 'transparent' ? 0 : StyleSheet.hairlineWidth * 2,
  });

  return (
    <View
      style={[
        preview.card,
        { backgroundColor: th.shell, borderColor: active ? accent : th.rule },
      ]}
    >
      <View style={[preview.display, { backgroundColor: th.textHi, opacity: 0.85 }]} />
      <View style={[preview.hairline, { backgroundColor: th.rule }]} />

      <View style={preview.row}>
        <View style={key(th.keyFill, th.keyBorder)} />
        <View style={key(th.keyFill, th.keyBorder)} />
        <View style={key(th.keyFill, th.keyBorder)} />
        <View style={key(th.opFill, th.opBorder)} />
      </View>
      <View style={preview.row}>
        <View style={key(th.keyFill, th.keyBorder)} />
        <View style={key(th.keyFill, th.keyBorder)} />
        <View style={key(th.fnFill, th.fnBorder)} />
        <View style={key(th.accent, 'transparent')} />
      </View>
    </View>
  );
}

function Label({ t, children }: { t: Theme; children: string }) {
  return <Text style={[s.sectionLabel, { color: t.textLo }]}>{children}</Text>;
}

/* ------------------------------------------------------------------ */

export default function Settings() {
  const t = useTheme();
  const themeName = useSettings((st) => st.themeName);
  const setTheme = useSettings((st) => st.setTheme);
  const haptics = useSettings((st) => st.haptics);
  const toggleHaptics = useSettings((st) => st.toggleHaptics);
  const angle = useCalculator((st) => st.angle);
  const toggleAngle = useCalculator((st) => st.toggleAngle);

  const names = Object.keys(themes) as ThemeName[];

  return (
    <SafeAreaView style={[s.fill, { backgroundColor: t.shell }]} edges={['top', 'bottom']}>
      <ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>

        {/* ---------------- masthead ---------------- */}
        <View style={s.header}>
          <View style={s.headerLeft}>
            <Text style={[s.title, { color: t.textHi }]}>Settings</Text>
            <View style={s.titleRule}>
              <View style={[s.titleRuleAccent, { backgroundColor: t.accent }]} />
              <View style={[s.titleRuleRest, { backgroundColor: t.rule }]} />
            </View>
          </View>

          <Pressable
            onPress={() => router.back()}
            hitSlop={14}
            style={({ pressed }) => [
              s.close,
              { borderColor: t.rule, opacity: pressed ? 0.5 : 1 },
            ]}
          >
            <MaterialCommunityIcons name="close" size={18} color={t.textLo} />
          </Pressable>
        </View>

        {/* ---------------- appearance ---------------- */}
        <Label t={t}>APPEARANCE</Label>

        <View style={s.grid}>
          {names.map((name) => {
            const th = themes[name];
            const active = name === themeName;
            return (
              <Pressable
                key={name}
                onPress={() => setTheme(name)}
                style={({ pressed }) => [s.tile, { opacity: pressed ? 0.65 : 1 }]}
              >
                <ThemePreview th={th} active={active} accent={t.accent} />
                <View style={s.tileFoot}>
                  <Text style={[s.tileLabel, { color: active ? t.textHi : t.textLo }]}>
                    {th.label}
                  </Text>
                  {active && (
                    <MaterialCommunityIcons name="check-circle" size={14} color={t.accent} />
                  )}
                </View>
              </Pressable>
            );
          })}
        </View>

        {/* ---------------- behaviour ---------------- */}
        <Label t={t}>BEHAVIOUR</Label>

        <View style={[s.group, { borderColor: t.rule }]}>
          <View
            style={[
              s.row,
              { borderBottomColor: t.rule, borderBottomWidth: StyleSheet.hairlineWidth },
            ]}
          >
            <View style={s.rowLeft}>
              <MaterialCommunityIcons name="vibrate" size={20} color={t.textLo} />
              <View>
                <Text style={[s.rowLabel, { color: t.textHi }]}>Haptics</Text>
                <Text style={[s.rowSub, { color: t.textLo }]}>Vibrate on key press</Text>
              </View>
            </View>
            <Switch
              value={haptics}
              onValueChange={toggleHaptics}
              trackColor={{ true: t.accent, false: t.rule }}
              thumbColor={t.shell}
            />
          </View>

          <Pressable
            onPress={toggleAngle}
            style={({ pressed }) => [s.row, { opacity: pressed ? 0.6 : 1 }]}
          >
            <View style={s.rowLeft}>
              <MaterialCommunityIcons name="angle-acute" size={20} color={t.textLo} />
              <View>
                <Text style={[s.rowLabel, { color: t.textHi }]}>Angle unit</Text>
                <Text style={[s.rowSub, { color: t.textLo }]}>For sin, cos, and tan</Text>
              </View>
            </View>
            <View style={[s.pill, { borderColor: t.accent }]}>
              <Text style={[s.pillText, { color: t.accent }]}>
                {angle === 'deg' ? 'Degrees' : 'Radians'}
              </Text>
            </View>
          </Pressable>
        </View>

        {/* ---------------- about ---------------- */}
        <Label t={t}>ABOUT</Label>

        <View style={s.cards}>
          <Link href="/about" asChild>
            <Pressable
              style={({ pressed }) => [
                s.card,
                { borderColor: t.rule, backgroundColor: t.surface, opacity: pressed ? 0.7 : 1 },
              ]}
            >
              <View style={[s.cardIcon, { borderColor: t.accent }]}>
                <MaterialCommunityIcons name="information-outline" size={20} color={t.accent} />
              </View>
              <Text style={[s.cardTitle, { color: t.textHi }]}>About</Text>
              <Text style={[s.cardSub, { color: t.textLo }]}>Version, engine, credits</Text>
              <MaterialCommunityIcons
                name="arrow-top-right"
                size={16}
                color={t.textLo}
                style={s.cardArrow}
              />
            </Pressable>
          </Link>

          <Link href="/privacy" asChild>
            <Pressable
              style={({ pressed }) => [
                s.card,
                { borderColor: t.rule, backgroundColor: t.surface, opacity: pressed ? 0.7 : 1 },
              ]}
            >
              <View style={[s.cardIcon, { borderColor: t.accent }]}>
                <MaterialCommunityIcons name="shield-check-outline" size={20} color={t.accent} />
              </View>
              <Text style={[s.cardTitle, { color: t.textHi }]}>Privacy</Text>
              <Text style={[s.cardSub, { color: t.textLo }]}>No data leaves this device</Text>
              <MaterialCommunityIcons
                name="arrow-top-right"
                size={16}
                color={t.textLo}
                style={s.cardArrow}
              />
            </Pressable>
          </Link>
        </View>

        <Text style={[s.footer, { color: t.textLo }]}>Calculator · 1.0.0</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

/* ------------------------------------------------------------------ */

const preview = StyleSheet.create({
  card: {
    height: 88,
    borderRadius: 10,
    borderWidth: StyleSheet.hairlineWidth * 3,
    padding: 9,
    justifyContent: 'center',
    gap: 5,
  },
  display: {
    width: '55%',
    height: 7,
    borderRadius: 2,
    alignSelf: 'flex-end',
  },
  hairline: { height: StyleSheet.hairlineWidth, marginVertical: 3 },
  row: { flexDirection: 'row', gap: 5, justifyContent: 'space-between' },
});

const s = StyleSheet.create({
  fill: { flex: 1 },
  content: { paddingHorizontal: 22, paddingTop: 12, paddingBottom: 44 },

  /* masthead */
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  headerLeft: { flex: 1 },
  title: {
    fontSize: 38,
    fontWeight: '200',
    letterSpacing: -1.2,
    lineHeight: 44,
  },
  titleRule: {
    flexDirection: 'row',
    marginTop: 16,
    height: 2,
  },
  titleRuleAccent: { width: 32, height: 2 },
  titleRuleRest: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
    alignSelf: 'center',
  },
  close: {
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: StyleSheet.hairlineWidth * 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },

  sectionLabel: {
    fontSize: 11,
    letterSpacing: 2,
    marginTop: 32,
    marginBottom: 14,
  },

  /* theme grid */
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 16,
  },
  tile: { width: '48%' },
  tileFoot: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
    paddingHorizontal: 2,
  },
  tileLabel: { fontSize: 13, letterSpacing: 0.2 },

  /* behaviour */
  group: {
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 12,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  rowLeft: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  rowLabel: { fontSize: 16 },
  rowSub: { fontSize: 12, marginTop: 2 },
  pill: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
    borderWidth: StyleSheet.hairlineWidth * 2,
  },
  pillText: { fontSize: 13, letterSpacing: 0.3 },

  /* about cards */
  cards: { flexDirection: 'row', gap: 12 },
  card: {
    flex: 1,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 14,
    padding: 16,
    paddingBottom: 18,
  },
  cardIcon: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: StyleSheet.hairlineWidth * 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  cardTitle: { fontSize: 16, marginBottom: 3 },
  cardSub: { fontSize: 12, lineHeight: 17 },
  cardArrow: { position: 'absolute', top: 16, right: 16 },

  footer: {
    fontSize: 12,
    textAlign: 'center',
    marginTop: 40,
    letterSpacing: 0.4,
  },
});