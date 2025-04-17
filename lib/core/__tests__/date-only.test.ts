import { DateOnly } from '../date-only';

describe('DateOnly', () => {
  it('should create a new DateOnly instance', () => {
    const date = new Date('2025-04-17T10:00:00Z');
    const dateOnly = new DateOnly(date);
    expect(dateOnly).toBeInstanceOf(DateOnly);
  });

  it('should return the correct day', () => {
    const date = new Date('2025-04-17T10:00:00Z');
    const dateOnly = new DateOnly(date);
    expect(dateOnly.day).toBe(17);
  });

  it('should return the correct month', () => {
    const date = new Date('2025-04-17T10:00:00Z');
    const dateOnly = new DateOnly(date);
    expect(dateOnly.month).toBe(4);
  });

  it('should return the correct year', () => {
    const date = new Date('2025-04-17T10:00:00Z');
    const dateOnly = new DateOnly(date);
    expect(dateOnly.year).toBe(2025);
  });
});
