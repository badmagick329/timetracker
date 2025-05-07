import { DateOnly } from './date-only';

export class Timespan {
  private _logicalDate: DateOnly;

  start: Date;
  end?: Date;

  private constructor(start: Date, logicalDate: DateOnly, end?: Date) {
    this.start = start;
    this._logicalDate = logicalDate;
    this.end = end;
  }

  public static create(start: Date, logicalDate: DateOnly, end?: Date) {
    if (end && start >= end) {
      throw new Error('Start date must be before end date');
    }

    return new Timespan(start, logicalDate, end);
  }

  /**
   * Returns the duration of the timespan in milliseconds. Min 0
   */
  get duration(): number {
    return this.end
      ? Math.max(this.end.getTime() - this.start.getTime(), 0)
      : Math.max(new Date().getTime() - this.start.getTime(), 0);
  }

  get logicalDate(): DateOnly {
    return this._logicalDate;
  }

  toJSON() {
    return {
      start: this.start.toString(),
      end: this.end?.toString() || '',
      logicalDate: this._logicalDate.toString(),
    };
  }
}
