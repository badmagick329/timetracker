import { DateOnly } from './date-only';

export class Timespan {
  private _start: Date;
  private _logicalDate: DateOnly;
  end?: Date;

  private constructor(start: Date, logicalDate: DateOnly, end?: Date) {
    this._start = start;
    this._logicalDate = logicalDate;
    this.end = end;
  }

  public static create(start: Date, logicalDate: DateOnly, end?: Date) {
    if (end && start >= end) {
      throw new Error('Start date must be before end date');
    }

    return new Timespan(start, logicalDate, end);
  }

  get start(): Date {
    return this._start;
  }

  /**
   * Returns the duration of the timespan in milliseconds.
   */
  get duration(): number {
    return this.end
      ? this.end.getTime() - this._start.getTime()
      : new Date().getTime() - this._start.getTime();
  }

  get logicalDate(): DateOnly {
    return this._logicalDate;
  }

  toJSON() {
    return {
      start: this._start.toString(),
      end: this.end?.toString() || '',
      logicalDate: this._logicalDate.toString(),
    };
  }
}
