import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Linking, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/store/useSettings';
import { type Theme } from '@/theme/themes';

const EMAIL = 'ayush@example.com';   // ← replace
const UPDATED = 'July 2026';

export default function Privacy() {
  const t = useTheme();

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

        {/* ---------------- the claim ---------------- */}
        <View style={s.hero}>
          <View style={[s.shield, { borderColor: t.accent }]}>
            <MaterialCommunityIcons name="shield-check" size={26} color={t.accent} />
          </View>

          <Text style={[s.claim, { color: t.textHi }]}>
            This app collects{'\n'}nothing about you.
          </Text>

          <Text style={[s.updated, { color: t.textLo }]}>Last updated {UPDATED}</Text>
        </View>

        <View style={s.rule}>
          <View style={[s.ruleAccent, { backgroundColor: t.accent }]} />
          <View style={[s.ruleRest, { backgroundColor: t.rule }]} />
        </View>

        {/* ---------------- the three guarantees ---------------- */}
        <View style={s.guarantees}>
          <Guarantee t={t} icon="wifi-off" title="No network" sub="Works entirely offline" />
          <Guarantee t={t} icon="account-off-outline" title="No account" sub="Nothing to sign into" />
          <Guarantee t={t} icon="chart-line-variant" title="No tracking" sub="No analytics, no ads" />
        </View>

        {/* ---------------- the detail ---------------- */}
        <Section t={t} n="01" title="What stays on your device">
          Your calculation history, your chosen theme, and your haptics preference are
          stored locally using your phone's own storage. They never leave the device.
          There is no server to send them to. Uninstalling the app removes them
          permanently, and nothing survives it.
        </Section>

        <Section t={t} n="02" title="What is collected">
          Nothing. No account, no email address, no analytics, no advertising
          identifiers, no usage statistics, no crash telemetry, no device fingerprint.
          The app makes no network requests of any kind.
        </Section>

        <Section t={t} n="03" title="Permissions">
          The app requests no permissions. It cannot read your contacts, your location,
          your camera, your microphone, or your files — not because it chooses not to,
          but because it never asks for the ability.
        </Section>

        <Section t={t} n="04" title="Third parties">
          There are none. The app contains no third-party SDKs that collect data.
          Nothing is shared, sold, or transmitted, because nothing is gathered in the
          first place.
        </Section>

        <Section t={t} n="05" title="Children">
          The app is safe for all ages. Since no data is collected from anyone, no data
          is collected from children either.
        </Section>

        <Section t={t} n="06" title="Changes" last>
          If this policy ever changes, the date above changes with it. Any version of
          this app that collected data would say so plainly, here, before it did.
        </Section>

        {/* ---------------- contact ---------------- */}
        <Pressable
          onPress={() => Linking.openURL(`mailto:${EMAIL}?subject=Privacy%20question`)}
          style={({ pressed }) => [
            s.contact,
            { borderColor: t.rule, backgroundColor: t.surface, opacity: pressed ? 0.75 : 1 },
          ]}
        >
          <View style={s.contactText}>
            <Text style={[s.contactTitle, { color: t.textHi }]}>Questions?</Text>
            <Text style={[s.contactSub, { color: t.textLo }]}>{EMAIL}</Text>
          </View>
          <MaterialCommunityIcons name="email-outline" size={20} color={t.accent} />
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

/* ------------------------------------------------------------------ */

function Guarantee({
  t, icon, title, sub,
}: {
  t: Theme;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  title: string;
  sub: string;
}) {
  return (
    <View style={[s.guarantee, { borderColor: t.rule }]}>
      <MaterialCommunityIcons name={icon} size={22} color={t.accent} />
      <Text style={[s.gTitle, { color: t.textHi }]}>{title}</Text>
      <Text style={[s.gSub, { color: t.textLo }]}>{sub}</Text>
    </View>
  );
}

function Section({
  t, n, title, children, last = false,
}: {
  t: Theme;
  n: string;
  title: string;
  children: string;
  last?: boolean;
}) {
  return (
    <View
      style={[
        s.section,
        !last && { borderBottomColor: t.rule, borderBottomWidth: StyleSheet.hairlineWidth },
      ]}
    >
      <View style={s.sectionHead}>
        <Text style={[s.sectionNum, { color: t.accent }]}>{n}</Text>
        <Text style={[s.sectionTitle, { color: t.textHi }]}>{title}</Text>
      </View>
      <Text style={[s.sectionBody, { color: t.textLo }]}>{children}</Text>
    </View>
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
  hero: { marginTop: 30 },
  shield: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: StyleSheet.hairlineWidth * 3,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  claim: {
    fontSize: 30,
    fontWeight: '200',
    lineHeight: 40,
    letterSpacing: -0.8,
  },
  updated: { fontSize: 12, marginTop: 12, letterSpacing: 0.5 },

  rule: { flexDirection: 'row', height: 2, marginTop: 26, marginBottom: 26 },
  ruleAccent: { width: 32, height: 2 },
  ruleRest: { flex: 1, height: StyleSheet.hairlineWidth, alignSelf: 'center' },

  /* three guarantee cards */
  guarantees: { flexDirection: 'row', gap: 10, marginBottom: 40 },
  guarantee: {
    flex: 1,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 10,
    alignItems: 'center',
    gap: 8,
  },
  gTitle: { fontSize: 13, textAlign: 'center' },
  gSub: { fontSize: 11, textAlign: 'center', lineHeight: 15 },

  /* numbered sections */
  section: { paddingBottom: 26, marginBottom: 26 },
  sectionHead: { flexDirection: 'row', alignItems: 'baseline', gap: 12, marginBottom: 12 },
  sectionNum: {
    fontSize: 12,
    letterSpacing: 1,
    fontVariant: ['tabular-nums'],
  },
  sectionTitle: { fontSize: 17, fontWeight: '400', flex: 1 },
  sectionBody: { fontSize: 15, lineHeight: 26, fontWeight: '300', paddingLeft: 28 },

  /* contact */
  contact: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 18,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 14,
    marginTop: 12,
  },
  contactText: { flex: 1 },
  contactTitle: { fontSize: 17, marginBottom: 3 },
  contactSub: { fontSize: 13 },
});