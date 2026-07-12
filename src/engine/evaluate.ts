import { create, all, type MathJsInstance } from 'mathjs';

export type AngleUnit = 'deg' | 'rad';

export type CalcErrorCode =
  | 'DIVIDE_BY_ZERO'
  | 'MALFORMED'
  | 'DOMAIN'
  | 'OVERFLOW';

export class CalcError extends Error {
  constructor(message: string, readonly code: CalcErrorCode) {
    super(message);
    this.name = 'CalcError';
    Object.setPrototypeOf(this, CalcError.prototype);
  }
}

const math: MathJsInstance = create(all, {
  number: 'BigNumber',
  precision: 64,
});

// Only disable symbol/unit definition. Do NOT disable evaluate/parse —
// math.evaluate() calls them internally.
math.import(
  {
    import: () => { throw new Error('disabled'); },
    createUnit: () => { throw new Error('disabled'); },
  },
  { override: true },
);

/** Index of the paren that closes the one at `openIdx`, or -1. */
function matchingClose(s: string, openIdx: number): number {
  let depth = 0;
  for (let i = openIdx; i < s.length; i++) {
    if (s[i] === '(') depth++;
    else if (s[i] === ')') {
      depth--;
      if (depth === 0) return i;
    }
  }
  return -1;
}

/**
 * Google's percent is context-sensitive:
 *   50 + 10%  → 50 + 50*(10/100)  = 55
 *   50 - 10%  → 50 - 50*(10/100)  = 45
 *   50 * 10%  → 50 * (10/100)     = 5
 *   50 / 10%  → 50 / (10/100)     = 500
 *   10%       → (10/100)          = 0.1
 *
 * For +/- the percent applies to the ENTIRE running left-hand side, not
 * just the adjacent term. 100+10%+10% = 121 (the second 10% is of 110),
 * not 110.01. So the left operand is everything before the operator.
 */
export function expandPercent(input: string): string {
  let s = input;
  let i = 0;

  while (i < s.length) {
    if (s[i] !== '%') { i++; continue; }

    const numEnd = i;
    let numStart = numEnd - 1;
    while (numStart >= 0 && /[\d.]/.test(s[numStart])) numStart--;
    numStart++;

    if (numStart === numEnd) { i++; continue; }
    const pct = s.slice(numStart, numEnd);

    let opIdx = numStart - 1;
    while (opIdx >= 0 && /\s/.test(s[opIdx])) opIdx--;
    const op = opIdx >= 0 ? s[opIdx] : '';

    let replacement: string;
    let replaceFrom: number;

    if (op === '+' || op === '-' || op === '−') {
      const left = s.slice(0, opIdx);
      if (left.trim() === '') {
        replacement = `(${pct}/100)`;
        replaceFrom = numStart;
      } else {
        const normOp = op === '−' ? '-' : op;
        replacement = `(${left})${normOp}(${left})*(${pct}/100)`;
        replaceFrom = 0;
      }
    } else {
      replacement = `(${pct}/100)`;
      replaceFrom = numStart;
    }

    s = s.slice(0, replaceFrom) + replacement + s.slice(i + 1);
    i = replaceFrom + replacement.length;
  }

  return s;
}

/**
 * Wraps each fn(...) argument as fn(before + arg + after), closing parens
 * at the correct position rather than appending them all at the end.
 * Recurses so nested calls inside the argument are handled too.
 */
function wrapArgs(
  s: string,
  fns: string[],
  before: string,
  after: string,
): string {
  const re = new RegExp(`(?<![a-z])(${fns.join('|')})\\(`, 'g');
  let out = '';
  let last = 0;
  let m: RegExpExecArray | null;

  while ((m = re.exec(s)) !== null) {
    const openIdx = m.index + m[0].length - 1;
    const closeIdx = matchingClose(s, openIdx);
    if (closeIdx === -1) break;

    const arg = s.slice(openIdx + 1, closeIdx);
    const inner = wrapArgs(arg, fns, before, after);

    out += s.slice(last, m.index) + `${m[1]}(${before}${inner}${after})`;
    last = closeIdx + 1;
    re.lastIndex = last;
  }

  return out + s.slice(last);
}

/**
 * Wraps each fn(...) CALL as (factor * fn(...)), i.e. transforms the result
 * rather than the argument. Used for inverse trig in degree mode.
 */
function wrapCalls(s: string, fns: string[], factor: string): string {
  const re = new RegExp(`(?<![a-z])(${fns.join('|')})\\(`, 'g');
  let out = '';
  let last = 0;
  let m: RegExpExecArray | null;

  while ((m = re.exec(s)) !== null) {
    const openIdx = m.index + m[0].length - 1;
    const closeIdx = matchingClose(s, openIdx);
    if (closeIdx === -1) break;

    const arg = s.slice(openIdx + 1, closeIdx);
    out += s.slice(last, m.index) + `(${factor}*${m[1]}(${arg}))`;
    last = closeIdx + 1;
    re.lastIndex = last;
  }

  return out + s.slice(last);
}

function normalize(input: string, angle: AngleUnit): string {
  let s = expandPercent(input);

  s = s
    .replace(/×/g, '*')
    .replace(/÷/g, '/')
    .replace(/−/g, '-')
    .replace(/π/g, 'pi')
    .replace(/√/g, 'sqrt');

  // Google: log = base 10, ln = natural.
  // mathjs:  log = natural; base-10 is the two-arg form log(x, 10).
  // Mark base-10 calls first so the ln→log pass can't sweep them up.
  s = s.replace(/(?<![a-z])log\(/g, '@L@(');
  s = s.replace(/(?<![a-z])ln\(/g, 'log(');

  let at = s.indexOf('@L@(');
  while (at !== -1) {
    const open = at + 3;
    const close = matchingClose(s, open);
    if (close === -1) {
      s = s.slice(0, at) + 'log(' + s.slice(open + 1) + ', 10)';
      break;
    }
    const arg = s.slice(open + 1, close);
    s = s.slice(0, at) + `log(${arg}, 10)` + s.slice(close + 1);
    at = s.indexOf('@L@(');
  }

  // Auto-close unbalanced parens BEFORE the trig passes, which rely on
  // matchingClose() finding a real closing paren.
  const opens = (s.match(/\(/g) ?? []).length;
  const closes = (s.match(/\)/g) ?? []).length;
  if (opens > closes) s += ')'.repeat(opens - closes);

  // Implicit multiplication
  s = s.replace(/(\d)\s*\(/g, '$1*(');
  s = s.replace(/\)\s*(\d)/g, ')*$1');
  s = s.replace(/\)\s*\(/g, ')*(');
  s = s.replace(/(\d)(pi|e)\b/g, '$1*$2');

  if (angle === 'deg') {
    // Inverse trig returns radians — scale the RESULT to degrees.
    // Run first, so the forward pass below doesn't see these calls.
    s = wrapCalls(s, ['asin', 'acos', 'atan'], '180/pi');

    // Forward trig takes degrees — scale the ARGUMENT to radians.
    // The lookbehind in wrapArgs prevents matching the "sin" inside "asin".
    s = wrapArgs(s, ['sin', 'cos', 'tan'], 'pi/180*(', ')');
  }

  return s;
}

export function evaluate(input: string, angle: AngleUnit = 'deg'): number {
  const trimmed = input.trim();
  if (trimmed === '') throw new CalcError('Malformed expression', 'MALFORMED');

  // mathjs computes gamma for 4.5!; Google refuses. Match Google.
  if (/\d*\.\d+\s*!/.test(trimmed) || /-\s*\d+\s*!/.test(trimmed)) {
    throw new CalcError("Can't compute that", 'DOMAIN');
  }

  const expr = normalize(trimmed, angle);

  let raw: unknown;
  try {
    raw = math.evaluate(expr);
  } catch {
    throw new CalcError('Malformed expression', 'MALFORMED');
  }

  if (raw === null || raw === undefined || typeof raw === 'function') {
    throw new CalcError('Malformed expression', 'MALFORMED');
  }

  let n: number;
  if (typeof raw === 'number') {
    n = raw;
  } else if (typeof (raw as any)?.toNumber === 'function') {
    n = (raw as any).toNumber();
  } else {
    // Complex, Unit, Matrix — not valid calculator output
    throw new CalcError("Can't compute that", 'DOMAIN');
  }

  if (Number.isNaN(n)) {
    throw new CalcError("Can't compute that", 'DOMAIN');
  }

  if (!Number.isFinite(n)) {
    if (/\/\s*\(?\s*0(?![.\d])/.test(expr)) {
      throw new CalcError("Can't divide by 0", 'DIVIDE_BY_ZERO');
    }
    throw new CalcError('Result too large', 'OVERFLOW');
  }

  // tan(90°) yields 1.633e16 from float drift, not a real result
  if (Math.abs(n) > 1e15) {
    throw new CalcError('Result too large', 'OVERFLOW');
  }

  return n;
}

export function preview(input: string, angle: AngleUnit = 'deg'): number | null {
  try {
    return evaluate(input, angle);
  } catch {
    return null;
  }
}