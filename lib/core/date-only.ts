export class DateOnly {
  private _value: Date;

  constructor(date: Date) {
    this._value = date;
  }

  get day(): number {
    return this._value.getUTCDate();
  }

  get month(): number {
    return this._value.getUTCMonth() + 1;
  }

  get year(): number {
    return this._value.getUTCFullYear();
  }

  public static fromYMD(v: string): DateOnly {
    if (!v) {
      throw new Error('Input string cannot be empty.');
    }
    const pattern = /^\d{4}-\d{2}-\d{2}$/;
    if (!pattern.test(v)) {
      throw new Error(`Invalid date format: "${v}". Expected YYYY-MM-DD.`);
    }
    const parts = v.split('-');
    const year = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10);
    const day = parseInt(parts[2], 10);

    if (isNaN(year) || isNaN(month) || isNaN(day)) {
      throw new Error(`Invalid date components in "${v}".`);
    }

    if (month < 1 || month > 12) {
      throw new Error(
        `Invalid month: ${month} in "${v}". Month must be between 1 and 12.`
      );
    }

    if (day < 1 || day > 31) {
      throw new Error(
        `Invalid day: ${day} in "${v}". Day must be between 1 and 31.`
      );
    }

    const date = new Date(Date.UTC(year, month - 1, day));

    if (
      date.getUTCFullYear() !== year ||
      date.getUTCMonth() !== month - 1 ||
      date.getUTCDate() !== day
    ) {
      throw new Error(
        `Invalid date: "${v}". The combination of year, month, and day is not valid.`
      );
    }

    return new DateOnly(date);
  }

  toString(): string {
    const year = this.year.toString().padStart(4, '0');
    const month = this.month.toString().padStart(2, '0');
    const day = this.day.toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  public equals(other: DateOnly) {
    return (
      this.year === other.year &&
      this.month === other.month &&
      this.day === other.day
    );
  }

  toJSON() {
    return this._value.toString();
  }

  addDays(days: number) {
    const yesterday = new Date(this._value);
    yesterday.setDate(yesterday.getDate() + days);
    return new DateOnly(yesterday);
  }

  static addDays(date: Date, days: number) {
    const yesterday = new Date(date);
    yesterday.setDate(yesterday.getDate() + days);
    return new DateOnly(yesterday);
  }
}
