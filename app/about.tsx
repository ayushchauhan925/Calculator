import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Link, router } from 'expo-router';
import * as StoreReview from 'expo-store-review';
import { Linking, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/store/useSettings';
import { type Theme } from '@/theme/themes';

const EMAIL = 'ayushchauhan.9525@gmail.com';
const GITHUB = 'ayushchauhan925';
const VERSION = '1.0.0';

export default function About() {
  const t = useTheme();

  const rate = async () => {
    if (await StoreReview.hasAction()) StoreReview.requestReview();
  };

  const mail = () => Linking.openURL(`mailto:${EMAIL}?subject=Calculator%20feedback`);
  const github = () => Linking.openURL(`https://github.com/${GITHUB}`);

  return (
    <SafeAreaView style={[s.fill, { backgroundColor: t.shell }]} edges={['top', 'bottom']}>
      <ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>

        <Pressable
          onPress={() => router.back()}
          hitSlop={14}
          style={({ pressed }) => [s.close, { borderColor: t.rule, opacity: pressed ? 0.5 : 1 }]}
        >
          <MaterialCommunityIcons name="arrow-left" size={18} color={t.textLo} />
        </Pressable>

        {/* ---------------- the mark ---------------- */}
        <View style={s.hero}>
          <View style={[s.mark, { borderColor: t.accent }]}>
            <Text style={[s.markGlyph, { color: t.accent }]}>=</Text>
          </View>

          <Text style={[s.name, { color: t.textHi }]}>Calculator</Text>

          <View style={[s.versionPill, { borderColor: t.rule }]}>
            <Text style={[s.versionText, { color: t.textLo }]}>Version {VERSION}</Text>
          </View>
        </View>

        {/* ---------------- the statement ---------------- */}
        <Text style={[s.statement, { color: t.textHi }]}>
          Everything a calculator{'\n'}should be. Nothing it{'\n'}shouldn't.
        </Text>

        <View style={s.rule}>
          <View style={[s.ruleAccent, { backgroundColor: t.accent }]} />
          <View style={[s.ruleRest, { backgroundColor: t.rule }]} />
        </View>

        <Text style={[s.body, { color: t.textLo }]}>
          Fast, accurate, and quiet. Seven themes, a scientific keypad when you need
          one, and a history that remembers what you worked out. No ads, no accounts,
          no clutter.
        </Text>

        {/* ---------------- the author ---------------- */}
        <Text style={[s.label, { color: t.textLo }]}>MADE BY</Text>

        <View style={[s.authorCard, { borderColor: t.rule, backgroundColor: t.surface }]}>
          <View style={s.authorTop}>
            <View style={[s.avatar, { borderColor: t.accent }]}>
              <Text style={[s.avatarText, { color: t.accent }]}>AC</Text>
            </View>
            <View style={s.authorText}>
              <Text style={[s.authorName, { color: t.textHi }]}>Ayush Chauhan</Text>
              <Text style={[s.authorRole, { color: t.textLo }]}>Design and engineering</Text>
            </View>
          </View>

          <View style={[s.authorDivider, { backgroundColor: t.rule }]} />

          <View style={s.authorLinks}>
            <Pressable
              onPress={mail}
              style={({ pressed }) => [s.linkBtn, { borderColor: t.rule, opacity: pressed ? 0.6 : 1 }]}
            >
              <MaterialCommunityIcons name="email-outline" size={17} color={t.accent} />
              <Text style={[s.linkText, { color: t.textHi }]}>Email</Text>
            </Pressable>

            <Pressable
              onPress={github}
              style={({ pressed }) => [s.linkBtn, { borderColor: t.rule, opacity: pressed ? 0.6 : 1 }]}
            >
              <MaterialCommunityIcons name="github" size={17} color={t.accent} />
              <Text style={[s.linkText, { color: t.textHi }]}>GitHub</Text>
            </Pressable>
          </View>

          <Text style={[s.authorEmail, { color: t.textLo }]} numberOfLines={1}>
            {EMAIL}
          </Text>
        </View>

        {/* ---------------- actions ---------------- */}
        <Text style={[s.label, { color: t.textLo }]}>MORE</Text>

        <View style={[s.group, { borderColor: t.rule }]}>
          <Action t={t} icon="star-outline" label="Rate this app" onPress={rate} divider />

          <Link href="/privacy" asChild>
            <Pressable style={({ pressed }) => [s.row, { opacity: pressed ? 0.6 : 1 }]}>
              <View style={s.rowLeft}>
                <MaterialCommunityIcons name="shield-check-outline" size={20} color={t.textLo} />
                <Text style={[s.rowLabel, { color: t.textHi }]}>Privacy policy</Text>
              </View>
              <MaterialCommunityIcons name="chevron-right" size={20} color={t.textLo} />
            </Pressable>
          </Link>
        </View>

        <Text style={[s.footer, { color: t.textLo }]}>
          © {new Date().getFullYear()} Ayush Chauhan
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

/* ------------------------------------------------------------------ */

function Action({
  t, icon, label, onPress, divider = false,
}: {
  t: Theme;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  label: string;
  onPress: () => void;
  divider?: boolean;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        s.row,
        divider && { borderBottomColor: t.rule, borderBottomWidth: StyleSheet.hairlineWidth },
        { opacity: pressed ? 0.6 : 1 },
      ]}
    >
      <View style={s.rowLeft}>
        <MaterialCommunityIcons name={icon} size={20} color={t.textLo} />
        <Text style={[s.rowLabel, { color: t.textHi }]}>{label}</Text>
      </View>
      <MaterialCommunityIcons name="chevron-right" size={20} color={t.textLo} />
    </Pressable>
  );
}

/* ------------------------------------------------------------------ */

const s = StyleSheet.create({
  fill: { flex: 1 },
  content: { paddingHorizontal: 22, paddingTop: 12, paddingBottom: 48 },

  close: {
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: StyleSheet.hairlineWidth * 2,
    alignItems: 'center',
    justifyContent: 'center',
  },

  /* hero */
  hero: { alignItems: 'center', marginTop: 28, marginBottom: 44 },
  mark: {
    width: 76,
    height: 76,
    borderRadius: 38,
    borderWidth: StyleSheet.hairlineWidth * 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  markGlyph: { fontSize: 32, fontWeight: '200' },
  name: { fontSize: 32, fontWeight: '200', letterSpacing: -0.8, marginTop: 20 },
  versionPill: {
    marginTop: 12,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    borderWidth: StyleSheet.hairlineWidth,
  },
  versionText: { fontSize: 11, letterSpacing: 0.8, fontVariant: ['tabular-nums'] },

  /* statement */
  statement: { fontSize: 27, fontWeight: '200', lineHeight: 38, letterSpacing: -0.7 },
  rule: { flexDirection: 'row', height: 2, marginTop: 24, marginBottom: 24 },
  ruleAccent: { width: 32, height: 2 },
  ruleRest: { flex: 1, height: StyleSheet.hairlineWidth, alignSelf: 'center' },

  body: { fontSize: 15, lineHeight: 27, fontWeight: '300' },

  label: { fontSize: 11, letterSpacing: 2, marginTop: 40, marginBottom: 14 },

  /* grouped rows */
  group: { borderWidth: StyleSheet.hairlineWidth, borderRadius: 12, overflow: 'hidden' },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  rowLeft: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  rowLabel: { fontSize: 15 },

  /* author */
  authorCard: {
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 14,
    padding: 18,
  },
  authorTop: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: StyleSheet.hairlineWidth * 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { fontSize: 15, letterSpacing: 1.2 },
  authorText: { flex: 1 },
  authorName: { fontSize: 18, marginBottom: 3 },
  authorRole: { fontSize: 13 },

  authorDivider: { height: StyleSheet.hairlineWidth, marginVertical: 18 },

  authorLinks: { flexDirection: 'row', gap: 10 },
  linkBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 11,
    borderWidth: StyleSheet.hairlineWidth * 2,
    borderRadius: 22,
  },
  linkText: { fontSize: 14 },

  authorEmail: {
    fontSize: 12,
    textAlign: 'center',
    marginTop: 14,
    letterSpacing: 0.2,
  },

  footer: { fontSize: 12, textAlign: 'center', marginTop: 48, letterSpacing: 0.4 },
});