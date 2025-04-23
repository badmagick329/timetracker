import { DateOnly } from './date-only';

export class Timespan {
  private _start: Date;
  private _end: Date;
  private _logicalDate: DateOnly;

  private constructor(start: Date, end: Date, logicalDate: DateOnly) {
    this._start = start;
    this._end = end;
    this._logicalDate = logicalDate;
  }

  public static create(start: Date, end: Date, logicalDate: DateOnly) {
    if (start >= end) {
      throw new Error('Start date must be before end date');
    }

    return new Timespan(start, end, logicalDate);
  }

  get start(): Date {
    return this._start;
  }

  get end(): Date {
    return this._end;
  }

  /**
   * Returns the duration of the timespan in milliseconds.
   */
  get duration(): number {
    return this._end.getTime() - this._start.getTime();
  }

  get logicalDate(): DateOnly {
    return this._logicalDate;
  }

  toJSON() {
    return {
      start: this._start.toString(),
      end: this._end.toString(),
      logicalDate: this._logicalDate.toString(),
    };
  }
}
