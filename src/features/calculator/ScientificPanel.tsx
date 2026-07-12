import { StyleSheet, View } from 'react-native';
import { useCalculator } from '@/store/useCalculator';
import { useTheme } from '@/store/useSettings';
import { layout } from '@/theme/layout';
import { CalcButton } from './CalcButton';

export function ScientificPanel() {
  const t = useTheme();
  const press = useCalculator((s) => s.press);
  const inv = useCalculator((s) => s.inv);
  const angle = useCalculator((s) => s.angle);
  const toggleInv = useCalculator((s) => s.toggleInv);
  const toggleAngle = useCalculator((s) => s.toggleAngle);

  const f = { fill: t.fnFill, text: t.fnText, border: t.fnBorder, compact: true };

  return (
    <View style={styles.panel}>
      <View style={styles.row}>
        <CalcButton label={inv ? 'x²' : '√'} onPress={() => press('√')} {...f} />
        <CalcButton label="π" onPress={() => press('π')} {...f} />
        <CalcButton label="^" onPress={() => press('^')} {...f} />
        <CalcButton label="!" onPress={() => press('!')} {...f} />
      </View>

      <View style={styles.row}>
        <CalcButton label={angle === 'deg' ? 'Deg' : 'Rad'} onPress={toggleAngle} {...f} />
        <CalcButton label={inv ? 'sin⁻¹' : 'sin'} onPress={() => press('sin')} {...f} />
        <CalcButton label={inv ? 'cos⁻¹' : 'cos'} onPress={() => press('cos')} {...f} />
        <CalcButton label={inv ? 'tan⁻¹' : 'tan'} onPress={() => press('tan')} {...f} />
      </View>

      <View style={styles.row}>
        <CalcButton
          label="Inv"
          onPress={toggleInv}
          fill={inv ? t.opFill : t.fnFill}
          text={inv ? t.opText : t.fnText}
          border={inv ? t.opBorder : t.fnBorder}
          compact
        />
        <CalcButton label="e" onPress={() => press('e')} {...f} />
        <CalcButton label={inv ? 'eˣ' : 'ln'} onPress={() => press('ln')} {...f} />
        <CalcButton label={inv ? '10ˣ' : 'log'} onPress={() => press('log')} {...f} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  panel: { gap: layout.gap, marginBottom: layout.gap + 4 },
  row: { flexDirection: 'row', gap: layout.gap },
});