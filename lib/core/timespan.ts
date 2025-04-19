import { DateOnly } from './date-only';

export class Timespan {
  private start: Date;
  private end: Date;
  private _logicalDate: DateOnly;

  private constructor(start: Date, end: Date, logicalDate: DateOnly) {
    this.start = start;
    this.end = end;
    this._logicalDate = logicalDate;
  }

  public static create(start: Date, end: Date, logicalDate: DateOnly) {
    if (start >= end) {
      throw new Error('Start date must be before end date');
    }

    return new Timespan(start, end, logicalDate);
  }

  /**
   * Returns the duration of the timespan in milliseconds.
   */
  get duration(): number {
    return this.end.getTime() - this.start.getTime();
  }

  get logicalDate(): DateOnly {
    return this._logicalDate;
  }
}
