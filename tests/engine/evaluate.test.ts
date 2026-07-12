import { describe, test, expect } from 'vitest';
import { evaluate, preview, expandPercent, CalcError } from '@/engine/evaluate';

describe('arithmetic', () => {
  test('addition', () => expect(evaluate('2+3')).toBe(5));
  test('precedence', () => expect(evaluate('2+3*4')).toBe(14));
  test('parens override precedence', () => expect(evaluate('(2+3)*4')).toBe(20));
  test('nested parens', () => expect(evaluate('((2+3)*(4-1))')).toBe(15));
  test('negative result', () => expect(evaluate('3-10')).toBe(-7));
  test('exponent', () => expect(evaluate('2^10')).toBe(1024));
  test('factorial', () => expect(evaluate('5!')).toBe(120));
  test('sqrt', () => expect(evaluate('sqrt(16)')).toBe(4));
});

describe('float correctness', () => {
  test('0.1 + 0.2 is exactly 0.3', () => expect(evaluate('0.1+0.2')).toBe(0.3));
  test('0.3 - 0.1 is exactly 0.2', () => expect(evaluate('0.3-0.1')).toBe(0.2));
  test('1.005 * 100', () => expect(evaluate('1.005*100')).toBe(100.5));
});

describe('input forgiveness', () => {
  test('auto-closes one paren', () => expect(evaluate('2*(3+4')).toBe(14));
  test('auto-closes two parens', () => expect(evaluate('2*(3+(4')).toBe(14));
  test('implicit multiply before paren', () => expect(evaluate('2(3+4)')).toBe(14));
  test('implicit multiply after paren', () => expect(evaluate('(3+4)2')).toBe(14));
  test('implicit multiply between parens', () => expect(evaluate('(2)(3)')).toBe(6));
});

describe('logarithms', () => {
  test('log is base 10', () => expect(evaluate('log(100)')).toBe(2));
  test('log(1000)', () => expect(evaluate('log(1000)')).toBeCloseTo(3));
  test('ln is natural', () => expect(evaluate('ln(e)')).toBeCloseTo(1));
  test('ln(1) is zero', () => expect(evaluate('ln(1)')).toBe(0));
});

describe('trigonometry — degrees', () => {
  test('sin(90) = 1', () => expect(evaluate('sin(90)', 'deg')).toBeCloseTo(1));
  test('cos(0) = 1', () => expect(evaluate('cos(0)', 'deg')).toBeCloseTo(1));
  test('sin(30) = 0.5', () => expect(evaluate('sin(30)', 'deg')).toBeCloseTo(0.5));
  test('tan(45) = 1', () => expect(evaluate('tan(45)', 'deg')).toBeCloseTo(1));
  test('asin(1) returns degrees', () => expect(evaluate('asin(1)', 'deg')).toBeCloseTo(90));
  test('atan(1) returns degrees', () => expect(evaluate('atan(1)', 'deg')).toBeCloseTo(45));
});

describe('trigonometry — radians', () => {
  test('sin(pi/2) = 1', () => expect(evaluate('sin(pi/2)', 'rad')).toBeCloseTo(1));
  test('cos(pi) = -1', () => expect(evaluate('cos(pi)', 'rad')).toBeCloseTo(-1));
  test('asin(1) returns radians', () => expect(evaluate('asin(1)', 'rad')).toBeCloseTo(1.5708));
});

describe('percent — context sensitive', () => {
  test('50+10% = 55', () => expect(evaluate('50+10%')).toBe(55));
  test('50-10% = 45', () => expect(evaluate('50-10%')).toBe(45));
  test('50*10% = 5', () => expect(evaluate('50*10%')).toBe(5));
  test('50/10% = 500', () => expect(evaluate('50/10%')).toBe(500));
  test('bare percent', () => expect(evaluate('10%')).toBe(0.1));
  test('paren group as left operand', () => expect(evaluate('(2+3)+10%')).toBe(5.5));
  test('200+15%', () => expect(evaluate('200+15%')).toBe(230));
});

describe('errors', () => {
  test('divide by zero', () => expect(() => evaluate('1/0')).toThrow(CalcError));
  test('divide by zero has right code', () => {
    try {
      evaluate('1/0');
    } catch (e) {
      expect((e as CalcError).code).toBe('DIVIDE_BY_ZERO');
    }
  });
  test('empty string', () => expect(() => evaluate('')).toThrow(CalcError));
  test('malformed', () => expect(() => evaluate('2++')).toThrow(CalcError));
  test('sqrt of negative', () => expect(() => evaluate('sqrt(-1)')).toThrow(CalcError));
  test('non-integer factorial', () => expect(() => evaluate('4.5!')).toThrow(CalcError));
  test('tan(90) overflows', () => expect(() => evaluate('tan(90)', 'deg')).toThrow(CalcError));
});

describe('preview', () => {
  test('incomplete expression returns null', () => expect(preview('2+')).toBeNull());
  test('empty returns null', () => expect(preview('')).toBeNull());
  test('valid expression returns number', () => expect(preview('2+3')).toBe(5));
});

describe('expandPercent', () => {
  test('additive rewrites left operand', () =>
    expect(expandPercent('50+10%')).toBe('50+50*(10/100)'));
  test('multiplicative is plain division', () =>
    expect(expandPercent('50*10%')).toBe('50*(10/100)'));
});