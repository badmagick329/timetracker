export class Category {
  private name: string;

  private constructor(name: string) {
    this.name = name;
  }

  public static create(name: string) {
    name = name.trim();
    if (name === '') {
      throw new Error('Name cannot be empty');
    }

    return new Category(name);
  }

  public equals(other: Category) {
    return this.name.toLowerCase() === other.name.toLowerCase();
  }

  public toString(): string {
    return this.name;
  }
}
