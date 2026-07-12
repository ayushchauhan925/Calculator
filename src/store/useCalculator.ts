import { create } from 'zustand';
import { preview as evalPreview, evaluate, CalcError, type AngleUnit } from '@/engine/evaluate';
import { useHistory } from './useHistory';

type Key =
  | '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '.'
  | '+' | '−' | '×' | '÷'
  | '(' | ')' | '%' | '^' | '!'
  | 'π' | 'e' | '√'
  | 'sin' | 'cos' | 'tan' | 'ln' | 'log';

const OPERATORS = ['+', '−', '×', '÷', '^'];
const FUNCTIONS = ['sin', 'cos', 'tan', 'ln', 'log', '√'];

interface CalculatorState {
  expression: string;
  preview: number | null;
  error: string | null;
  justEvaluated: boolean;
  expanded: boolean;
  inv: boolean;
  angle: AngleUnit;

  press: (key: Key) => void;
  clear: () => void;
  backspace: () => void;
  equals: () => void;
  toggleExpanded: () => void;
  toggleInv: () => void;
  toggleAngle: () => void;
  setExpression: (expr: string) => void;
}

/** The () key inserts whichever paren is valid here. */
function smartParen(expr: string): string {
  const opens = (expr.match(/\(/g) ?? []).length;
  const closes = (expr.match(/\)/g) ?? []).length;
  const last = expr.slice(-1);

  // Nothing to close, or we just opened one / typed an operator → open
  if (opens === closes) return '(';
  if (last === '(' || OPERATORS.includes(last)) return '(';
  return ')';
}

/** Applies Inv mode to a function key. */
function resolveKey(key: Key, inv: boolean): string {
  if (!inv) {
    if (key === '√') return 'sqrt(';
    if (FUNCTIONS.includes(key)) return `${key}(`;
    return key;
  }
  switch (key) {
    case 'sin': return 'asin(';
    case 'cos': return 'acos(';
    case 'tan': return 'atan(';
    case '√':   return '^2';
    case 'ln':  return 'e^';
    case 'log': return '10^';
    default:    return key;
  }
}

export const useCalculator = create<CalculatorState>((set, get) => ({
  expression: '',
  preview: null,
  error: null,
  justEvaluated: false,
  expanded: false,
  inv: false,
  angle: 'deg',

  press: (key) => {
    const { expression, justEvaluated, inv, angle } = get();

    let base = expression;

    // After =, a digit or function starts fresh; an operator continues
    // from the result. This is the behaviour people expect.
    if (justEvaluated) {
      const continues = OPERATORS.includes(key) || key === '%' || key === '!';
      base = continues ? expression : '';
    }

    const token = key === '(' || key === ')' ? smartParen(base) : resolveKey(key, inv);
    const next = base + token;

    set({
      expression: next,
      preview: evalPreview(next, angle),
      error: null,
      justEvaluated: false,
      // Inv is a one-shot modifier, like Shift
      inv: FUNCTIONS.includes(key) ? false : inv,
    });
  },

  clear: () =>
    set({ expression: '', preview: null, error: null, justEvaluated: false }),

  backspace: () => {
    const { expression, angle } = get();
    // Delete whole tokens, not characters: "sin(" goes in one press
    const next = expression.replace(
      /(sqrt\(|asin\(|acos\(|atan\(|sin\(|cos\(|tan\(|log\(|ln\(|10\^|e\^|.)$/,
      '',
    );
    set({
      expression: next,
      preview: evalPreview(next, angle),
      error: null,
      justEvaluated: false,
    });
  },

  equals: () => {
    const { expression, angle } = get();
    if (expression.trim() === '') return;

    try {
      const result = evaluate(expression, angle);

      // Record it before the expression is overwritten with the result.
      useHistory.getState().add(expression, String(result));

      set({
        expression: String(result),
        preview: null,
        error: null,
        justEvaluated: true,
      });
    } catch (e) {
      set({
        error: e instanceof CalcError ? e.message : 'Error',
        preview: null,
      });
    }
  },

  toggleExpanded: () => set((s) => ({ expanded: !s.expanded })),
  toggleInv: () => set((s) => ({ inv: !s.inv })),
  toggleAngle: () => {
    const next: AngleUnit = get().angle === 'deg' ? 'rad' : 'deg';
    set({ angle: next, preview: evalPreview(get().expression, next) });
  },

  setExpression: (expr) =>
    set({
      expression: expr,
      preview: evalPreview(expr, get().angle),
      error: null,
      justEvaluated: false,
    }),
}));