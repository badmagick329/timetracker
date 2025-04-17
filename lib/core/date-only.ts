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

  public equals(other: DateOnly) {
    return (
      this.year === other.year &&
      this.month === other.month &&
      this.day === other.day
    );
  }
}
