import { describe, expect, it } from 'vitest';
import { formatMoney } from './money';

describe('formatMoney', () => {
  it('formats cents as USD', () => {
    expect(formatMoney(3999)).toBe('$39.99');
  });

  it('formats zero and large values', () => {
    expect(formatMoney(0)).toBe('$0.00');
    expect(formatMoney(123456)).toBe('$1,234.56');
  });
});
