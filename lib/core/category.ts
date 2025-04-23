export class Category {
  private _name: string;
  private _id: string;

  private constructor(name: string, id: string) {
    this._name = name;
    this._id = id;
  }

  static create(name: string, id: string = '') {
    name = name.trim();
    if (name === '') {
      throw new Error('Name cannot be empty');
    }

    return new Category(name, id);
  }

  get id(): string {
    return this._id;
  }

  set id(val) {
    this._id = val;
  }

  get name(): string {
    return this._name;
  }

  equals(other: Category) {
    return this._name.toLowerCase() === other.name.toLowerCase();
  }

  toString(): string {
    return this._name;
  }

  toJSON() {
    return {
      id: this._id,
      name: this._name,
    };
  }
}
