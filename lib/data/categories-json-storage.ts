import * as FileSystem from 'expo-file-system';
import { Category } from '@/lib/core/category';
import { ICategoriesRepository } from '@/lib/core/icategories-repository';

export class CategoriesJsonStorage implements ICategoriesRepository {
  private saveFile: string;
  private _categories: Category[];

  private constructor(saveFile: string, categories: Category[]) {
    this.saveFile = saveFile;
    this._categories = categories;
  }

  static async create(): Promise<CategoriesJsonStorage> {
    const saveDir = `${FileSystem.documentDirectory}Json/`;
    const saveFile = `${saveDir}categories.json`;
    await FileSystem.makeDirectoryAsync(saveDir, {
      intermediates: true,
    });
    const categories = await this.load(saveFile);
    await this.saveData(saveFile, categories);

    if (categories.length === 0) {
      categories.push(
        Category.create('gaming', CategoriesJsonStorage.toKey('gaming'))
      );
      categories.push(
        Category.create('study', CategoriesJsonStorage.toKey('study'))
      );
      categories.push(
        Category.create('workout', CategoriesJsonStorage.toKey('workout'))
      );
      await this.saveData(saveFile, categories);
    }

    return new CategoriesJsonStorage(saveFile, categories);
  }

  get categories(): Category[] {
    return this._categories;
  }

  async addCategory(category: Category): Promise<string> {
    if (
      this._categories.some(
        (c) => c.name.toLowerCase() === category.name.toLowerCase()
      )
    ) {
      console.warn(`Category with name "${category.name}" already exists.`);
      return category.name;
    }

    this._categories.push(category);
    category.id = CategoriesJsonStorage.toKey(category.name);
    console.log('Category added:', category);
    CategoriesJsonStorage.sortInPlace(this.categories);
    await this.save();
    return category.id;
  }

  async removeCategory(categoryId: string): Promise<string | undefined> {
    const index = this._categories.findIndex((c) => c.id === categoryId);
    if (index === -1) {
      console.error('Category not found for removal:', categoryId);
      return undefined;
    }

    this._categories.splice(index, 1);
    console.log('Category removed:', categoryId);
    CategoriesJsonStorage.sortInPlace(this.categories);
    await this.save();
    return categoryId;
  }

  getCategory(categoryId: string): Category | undefined {
    const category = this._categories.find((c) => c.id === categoryId);
    if (!category) {
      console.error('Category not found:', categoryId);
      return undefined;
    }
    return category;
  }

  async reset(): Promise<void> {
    this._categories = [];
    await this.save();
  }

  private static async load(saveFile: string): Promise<Category[]> {
    const info = await FileSystem.getInfoAsync(saveFile);
    if (!info.exists) {
      return [];
    }

    try {
      const fileContent = await FileSystem.readAsStringAsync(saveFile);
      console.log(`Categories file contents read:\n${fileContent}`);
      const categoriesData = JSON.parse(fileContent) as {
        id: string;
        name: string;
      }[];

      const loaded = categoriesData.map((catData) => {
        return Category.create(catData.name, catData.id);
      });
      // console.log(`Loaded ${loaded.length} categories`);

      CategoriesJsonStorage.sortInPlace(loaded);
      return loaded;
    } catch (error) {
      console.error('Error loading categories from file:', error);
      return [];
    }
  }

  private static async saveData(
    saveFile: string,
    categories: Category[]
  ): Promise<void> {
    try {
      const fileContent = JSON.stringify(categories);
      await FileSystem.writeAsStringAsync(saveFile, fileContent);
      console.log('Categories saved to file:', saveFile);
    } catch (error) {
      console.error('Error saving categories to file:', error);
    }
  }

  private async save(): Promise<void> {
    await CategoriesJsonStorage.saveData(this.saveFile, this._categories);
  }

  private static toKey(name: string): string {
    return `${name}__${new Date()}`;
  }

  private static sortInPlace(categories: Category[]): void {
    categories.sort((a, b) => a.name.localeCompare(b.name));
  }
}
