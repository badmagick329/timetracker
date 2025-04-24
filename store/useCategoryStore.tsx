import { create } from 'zustand';
import { combine } from 'zustand/middleware';
import { Category } from '@/lib/core/category';
import { ICategoriesRepository } from '@/lib/core/icategories-repository';

type CategoryState = {
  categoriesRepository: ICategoriesRepository | undefined;
  categories: Category[];
  isLoading: boolean;
  isInitialized: boolean;
  error: string | null;
};

type CategoryActions = {
  initialize: (repository: ICategoriesRepository) => Promise<void>;
  createCategory: (categoryName: string) => Promise<Category | undefined>;
  removeCategory: (categoryId: string) => Promise<string | undefined>;
  getAllCategories: () => Category[];
  getCategory: (categoryId: string) => Category | undefined;
};

const initialState: CategoryState = {
  categoriesRepository: undefined,
  categories: [],
  isLoading: false,
  isInitialized: false,
  error: null,
};

export const useCategoryStore = create(
  combine<CategoryState, CategoryActions>(initialState, (set, get) => ({
    initialize: async (repository: ICategoriesRepository) => {
      if (get().isInitialized || get().isLoading) {
        return;
      }

      set({ isLoading: true, error: null });

      try {
        const initialCategories = repository.categories;

        set({
          categoriesRepository: repository,
          categories: initialCategories,
          isLoading: false,
          isInitialized: true,
          error: null,
        });
      } catch (err) {
        console.error('Failed to initialize categories repository:', err);
        set({
          categoriesRepository: undefined,
          categories: [],
          isLoading: false,
          isInitialized: true,
          error:
            err instanceof Error ? err.message : 'Unknown initialization error',
        });
      }
    },

    createCategory: async (categoryName: string) => {
      const { categoriesRepository } = get();
      if (!categoriesRepository) {
        console.error(
          'Cannot add category: Categories Repository not initialized.'
        );
        return undefined;
      }

      try {
        const newCategory = Category.create(categoryName);
        await categoriesRepository.addCategory(newCategory);
        set({ categories: [...categoriesRepository.categories] });
        return newCategory;
      } catch (error) {
        console.error('Failed to add category:', error);
        return undefined;
      }
    },

    removeCategory: async (categoryId: string) => {
      const { categoriesRepository } = get();
      if (!categoriesRepository) {
        console.error(
          'Cannot remove category: Categories Repository not initialized.'
        );
        return undefined;
      }
      try {
        const removedId = await categoriesRepository.removeCategory(categoryId);
        if (removedId) {
          set({ categories: [...categoriesRepository.categories] });
        }
        return removedId;
      } catch (error) {
        console.error('Failed to remove category:', error);
        return undefined;
      }
    },

    getAllCategories: () => {
      return get().categories;
    },

    getCategory: (categoryId: string) => {
      const { categoriesRepository } = get();
      if (!categoriesRepository) {
        console.error(
          'Cannot get category: Categories Repository not initialized.'
        );
        return undefined;
      }
      try {
        return categoriesRepository.getCategory(categoryId);
      } catch (error) {
        console.error('Failed to get category:', error);
        return undefined;
      }
    },
  }))
);
