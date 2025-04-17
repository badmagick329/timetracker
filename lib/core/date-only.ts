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
}
