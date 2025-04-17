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

  describe('equals', () => {
    it('should return true when comparing identical dates', () => {
      const date1 = new Date('2025-04-17T10:00:00Z');
      const date2 = new Date('2025-04-17T15:30:00Z');
      const dateOnly1 = new DateOnly(date1);
      const dateOnly2 = new DateOnly(date2);
      expect(dateOnly1.equals(dateOnly2)).toBe(true);
    });

    it('should return false when comparing different dates', () => {
      const date1 = new Date('2025-04-17T10:00:00Z');
      const date2 = new Date('2025-04-18T10:00:00Z');
      const dateOnly1 = new DateOnly(date1);
      const dateOnly2 = new DateOnly(date2);
      expect(dateOnly1.equals(dateOnly2)).toBe(false);
    });

    it('should return false when comparing dates with different months', () => {
      const date1 = new Date('2025-04-17T10:00:00Z');
      const date2 = new Date('2025-05-17T10:00:00Z');
      const dateOnly1 = new DateOnly(date1);
      const dateOnly2 = new DateOnly(date2);
      expect(dateOnly1.equals(dateOnly2)).toBe(false);
    });

    it('should return false when comparing dates with different years', () => {
      const date1 = new Date('2025-04-17T10:00:00Z');
      const date2 = new Date('2024-04-17T10:00:00Z');
      const dateOnly1 = new DateOnly(date1);
      const dateOnly2 = new DateOnly(date2);
      expect(dateOnly1.equals(dateOnly2)).toBe(false);
    });
  });
});
