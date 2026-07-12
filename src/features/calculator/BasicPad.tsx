import { StyleSheet, View } from 'react-native';
import { useCalculator } from '@/store/useCalculator';
import { useTheme } from '@/store/useSettings';
import { layout } from '@/theme/layout';
import { CalcButton } from './CalcButton';

export function BasicPad({ compact }: { compact: boolean }) {
  const t = useTheme();
  const press = useCalculator((s) => s.press);
  const clear = useCalculator((s) => s.clear);
  const backspace = useCalculator((s) => s.backspace);
  const equals = useCalculator((s) => s.equals);

  const d = { fill: t.keyFill, text: t.keyText, border: t.keyBorder, compact };
  const o = { fill: t.opFill, text: t.opText, border: t.opBorder, compact };

  return (
    <View style={styles.pad}>
      <View style={styles.row}>
        <CalcButton label="AC" onPress={clear} {...o} />
        <CalcButton label="( )" onPress={() => press('(')} {...o} />
        <CalcButton label="%" onPress={() => press('%')} {...o} />
        <CalcButton icon="division" onPress={() => press('÷')} {...o} />
      </View>

      <View style={styles.row}>
        <CalcButton label="7" onPress={() => press('7')} {...d} />
        <CalcButton label="8" onPress={() => press('8')} {...d} />
        <CalcButton label="9" onPress={() => press('9')} {...d} />
        <CalcButton icon="close" onPress={() => press('×')} {...o} />
      </View>

      <View style={styles.row}>
        <CalcButton label="4" onPress={() => press('4')} {...d} />
        <CalcButton label="5" onPress={() => press('5')} {...d} />
        <CalcButton label="6" onPress={() => press('6')} {...d} />
        <CalcButton icon="minus" onPress={() => press('−')} {...o} />
      </View>

      <View style={styles.row}>
        <CalcButton label="1" onPress={() => press('1')} {...d} />
        <CalcButton label="2" onPress={() => press('2')} {...d} />
        <CalcButton label="3" onPress={() => press('3')} {...d} />
        <CalcButton icon="plus" onPress={() => press('+')} {...o} />
      </View>

      <View style={styles.row}>
        <CalcButton label="0" onPress={() => press('0')} {...d} />
        <CalcButton label="." onPress={() => press('.')} {...d} />
        <CalcButton icon="backspace-outline" onPress={backspace} {...d} />
        <CalcButton
          icon="equal"
          onPress={equals}
          fill={t.accent}
          text={t.accentText}
          isAccent
          compact={compact}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  pad: { gap: layout.gap },
  row: { flexDirection: 'row', gap: layout.gap },
});