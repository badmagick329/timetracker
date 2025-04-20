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
    const [year, month, day] = v.split('-').map(Number);
    return new DateOnly(new Date(Date.UTC(year, month - 1, day)));
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
}
