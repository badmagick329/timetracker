import { DateOnly } from './date-only';
import { Datetime } from './datetime';

export class Timespan {
  private start: Datetime;
  private end: Datetime;
  private _logicalDate: DateOnly;

  private constructor(start: Datetime, end: Datetime, logicalDate: DateOnly) {
    this.start = start;
    this.end = end;
    this._logicalDate = logicalDate;
  }

  public static create(start: Datetime, end: Datetime, logicalDate: DateOnly) {
    if (start.value >= end.value) {
      throw new Error('Start date must be before end date');
    }

    return new Timespan(start, end, logicalDate);
  }

  /**
   * Returns the duration of the timespan in milliseconds.
   */
  get duration(): number {
    return this.end.value.getTime() - this.start.value.getTime();
  }

  get logicalDate(): DateOnly {
    return this._logicalDate;
  }
}
