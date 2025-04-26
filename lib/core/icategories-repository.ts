import { Category } from './category';

export interface ICategoriesRepository {
  categories: Category[];
  addCategory(category: Category): Promise<string>;
  removeCategory(categoryId: string): Promise<string | undefined>;
  getCategory(categoryId: string): Category | undefined;
  reset(): Promise<void>;
}
