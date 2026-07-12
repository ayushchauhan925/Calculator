import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Pressable, StyleSheet, Text } from 'react-native';
import { useSettings, useTheme } from '@/store/useSettings';
import { layout } from '@/theme/layout';

type IconName = keyof typeof MaterialCommunityIcons.glyphMap;

type Props = {
  label?: string;
  icon?: IconName;
  onPress: () => void;
  fill: string;
  text: string;
  border?: string;
  isAccent?: boolean;
  compact?: boolean;
  flex?: number;
};

export function CalcButton({
  label, icon, onPress, fill, text, border, isAccent = false, compact = false, flex = 1,
}: Props) {
  const t = useTheme();
  const hapticsOn = useSettings((s) => s.haptics);
  const h = compact ? layout.keyHeightExpanded : layout.keyHeightCollapsed;

  const radius =
    t.keyShape === 'circle' ? h / 2 :
    t.keyShape === 'square' ? 0 :
    t.radius;

  const hasBorder = border && border !== 'transparent';

  return (
    <Pressable
      onPress={() => {
        if (hapticsOn) {
          Haptics.impactAsync(
            isAccent ? Haptics.ImpactFeedbackStyle.Medium : Haptics.ImpactFeedbackStyle.Light,
          );
        }
        onPress();
      }}
      style={({ pressed }) => [
        styles.key,
        {
          height: h,
          borderRadius: radius,
          backgroundColor: pressed && !isAccent && fill === 'transparent'
            ? t.rule                       // unfilled keys fill on press
            : fill,
          borderColor: hasBorder ? border : 'transparent',
          borderWidth: hasBorder ? StyleSheet.hairlineWidth * 2 : 0,
          flex,
          transform: [{ scale: pressed ? 0.96 : 1 }],
          opacity: pressed && fill !== 'transparent' ? 0.82 : 1,
        },
      ]}
    >
      {icon ? (
        <MaterialCommunityIcons name={icon} size={compact ? 18 : 24} color={text} />
      ) : (
        <Text
          style={{
            color: text,
            fontSize: compact ? layout.keyFontExpanded : layout.keyFontCollapsed,
            fontWeight: '400',
            letterSpacing: 0.5,
            fontVariant: ['tabular-nums'],
          }}
        >
          {label}
        </Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  key: { alignItems: 'center', justifyContent: 'center' },
});