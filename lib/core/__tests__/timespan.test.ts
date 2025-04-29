import { DateOnly } from '../date-only';
import { Timespan } from '../timespan';

describe('Timespan', () => {
  it('should create a timespan with valid start and end times', () => {
    const start = new Date('2025-04-17T10:00:00Z');
    const end = new Date('2025-04-17T12:00:00Z');
    const logicalDate = new DateOnly(new Date('2025-04-17'));

    const timespan = Timespan.create(start, logicalDate, end);

    expect(timespan).toBeInstanceOf(Timespan);
    expect(timespan.logicalDate).toBe(logicalDate);
    expect(timespan.start).toBe(start);
    expect(timespan.end).toBe(end);
  });

  it('should create a timespan with undefined end time', () => {
    const start = new Date('2025-04-17T10:00:00Z');
    const logicalDate = new DateOnly(new Date('2025-04-17'));

    const timespan = Timespan.create(start, logicalDate);

    expect(timespan).toBeInstanceOf(Timespan);
    expect(timespan.logicalDate).toBe(logicalDate);
    expect(timespan.start).toBe(start);
    expect(timespan.end).toBeUndefined();
  });

  it('should calculate the correct duration in milliseconds when end time is defined', () => {
    const start = new Date('2025-04-17T10:00:00Z');
    const end = new Date('2025-04-17T12:00:00Z');
    const logicalDate = new DateOnly(new Date('2025-04-17'));

    const timespan = Timespan.create(start, logicalDate, end);

    expect(timespan.duration).toBe(2 * 60 * 60 * 1000);
  });

  it('should throw an error if start time is after end time', () => {
    const start = new Date('2025-04-17T14:00:00Z');
    const end = new Date('2025-04-17T12:00:00Z');
    const logicalDate = new DateOnly(new Date('2025-04-17'));

    expect(() => {
      Timespan.create(start, logicalDate, end);
    }).toThrow('Start date must be before end date');
  });

  it('should throw an error if start time equals end time', () => {
    const sameDate = new Date('2025-04-17T12:00:00Z');
    const logicalDate = new DateOnly(new Date('2025-04-17'));

    expect(() => {
      Timespan.create(sameDate, logicalDate, sameDate);
    }).toThrow('Start date must be before end date');
  });
});
