import { Pressable, StyleSheet, View } from 'react-native';
import { useCalculator } from '@/store/useCalculator';
import { useTheme } from '@/store/useSettings';
import { layout } from '@/theme/layout';
import { BasicPad } from './BasicPad';
import { ScientificPanel } from './ScientificPanel';

export function Keypad() {
  const t = useTheme();
  const expanded = useCalculator((s) => s.expanded);
  const toggleExpanded = useCalculator((s) => s.toggleExpanded);

  return (
    <View style={styles.wrap}>
      <Pressable onPress={toggleExpanded} style={styles.handleZone} hitSlop={16}>
        <View style={[styles.grip, { backgroundColor: expanded ? t.accent : t.textLo }]} />
      </Pressable>

      {expanded && <ScientificPanel />}
      <BasicPad compact={expanded} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { paddingHorizontal: layout.padding, paddingBottom: layout.padding },
  handleZone: { alignSelf: 'center', paddingVertical: 14, marginBottom: 2 },
  grip: { width: 36, height: 3, borderRadius: 2 },
});