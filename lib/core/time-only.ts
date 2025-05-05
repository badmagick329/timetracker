export class TimeOnly {
  readonly hours: number;
  readonly minutes: number;
  readonly seconds: number;

  constructor(h: number, m: number, s = 0) {
    this.hours = h;
    this.minutes = m;
    this.seconds = s;
  }

  /**
   * Creates a TimeOnly instance from a string in the format "HH:MM:SS".
   */
  static fromHMS(v: string): TimeOnly {
    const parts = v.split(':');
    if (parts.length < 2 || parts.length > 3) {
      throw new Error(`Invalid time format: ${v}`);
    }
    const [h, m, s = '0'] = parts;
    const hours = Number(h),
      minutes = Number(m),
      seconds = Number(s);
    if (
      !Number.isInteger(hours) ||
      hours < 0 ||
      hours > 23 ||
      !Number.isInteger(minutes) ||
      minutes < 0 ||
      minutes > 59 ||
      !Number.isInteger(seconds) ||
      seconds < 0 ||
      seconds > 59
    ) {
      throw new Error(`Invalid time components in: ${v}`);
    }
    return new TimeOnly(hours, minutes, seconds);
  }

  static fromDate(date: Date): TimeOnly {
    return new TimeOnly(date.getHours(), date.getMinutes(), date.getSeconds());
  }

  toString(): string {
    const hours = this.hours.toString().padStart(2, '0');
    const minutes = this.minutes.toString().padStart(2, '0');
    const seconds = this.seconds.toString().padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
  }

  toHourAndMinutes(): string {
    const hours = this.hours.toString().padStart(2, '0');
    const minutes = this.minutes.toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  }

  toDate(): Date {
    const date = new Date();
    date.setHours(this.hours, this.minutes, this.seconds);
    return date;
  }

  equals(other: TimeOnly) {
    return (
      this.hours === other.hours &&
      this.minutes === other.minutes &&
      this.seconds === other.seconds
    );
  }

  toJSON(): string {
    return this.toString();
  }

  valueOf(): number {
    return this.hours * 3600 + this.minutes * 60 + this.seconds;
  }
}
