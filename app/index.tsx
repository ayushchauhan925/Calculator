import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Display } from '@/features/calculator/Display';
import { Keypad } from '@/features/calculator/Keypad';
import { useTheme } from '@/store/useSettings';
import { layout } from '@/theme/layout';

export default function Calculator() {
  const t = useTheme();

  return (
    <SafeAreaView style={[styles.fill, { backgroundColor: t.shell }]} edges={['top', 'bottom']}>
      <View style={styles.topBar}>
        <Link href="/history" asChild>
          <Pressable hitSlop={12} style={styles.iconBtn}>
            <MaterialCommunityIcons name="history" size={22} color={t.textLo} />
          </Pressable>
        </Link>
        <Link href="/settings" asChild>
          <Pressable hitSlop={12} style={styles.iconBtn}>
            <MaterialCommunityIcons name="tune-variant" size={22} color={t.textLo} />
          </Pressable>
        </Link>
      </View>

      <Display />
      <Keypad />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: layout.padding + 4,
    paddingTop: 6,
  },
  iconBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
});