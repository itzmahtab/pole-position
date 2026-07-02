import { describe, it, expect } from 'vitest';
import {
  formatNumber,
  formatPoints,
  formatPercent,
  formatPosition,
  formatTemp,
  hexToRgba,
  getContrastColor,
} from '@/lib/utils/formatters';

describe('formatters', () => {
  it('formatNumber adds commas', () => {
    expect(formatNumber(1000000)).toBe('1,000,000');
    expect(formatNumber(1234.56, 2)).toBe('1,234.56');
  });

  it('formatPoints handles thousands', () => {
    expect(formatPoints(1500)).toBe('1.5k');
    expect(formatPoints(999)).toBe('999');
  });

  it('formatPercent formats correctly', () => {
    expect(formatPercent(75.5)).toBe('75.5%');
    expect(formatPercent(75.555, 0)).toBe('76%');
  });

  it('formatPosition adds ordinal suffix', () => {
    expect(formatPosition(1)).toBe('1st');
    expect(formatPosition(2)).toBe('2nd');
    expect(formatPosition(3)).toBe('3rd');
    expect(formatPosition(4)).toBe('4th');
    expect(formatPosition(11)).toBe('11th');
    expect(formatPosition(21)).toBe('21st');
  });

  it('formatTemp converts correctly', () => {
    expect(formatTemp(25)).toBe('25°C');
    expect(formatTemp(25, 'F')).toBe('77°F');
  });

  it('hexToRgba converts correctly', () => {
    expect(hexToRgba('#e10600', 0.5)).toBe('rgba(225, 6, 0, 0.5)');
  });

  it('getContrastColor returns correct contrast', () => {
    expect(getContrastColor('#ffffff')).toBe('#000000');
    expect(getContrastColor('#000000')).toBe('#ffffff');
  });
});
