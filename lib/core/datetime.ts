export class Datetime {
  private _value: Date;

  constructor(dt: Date) {
    this._value = dt;
  }

  get value(): Date {
    return this._value;
  }
}
