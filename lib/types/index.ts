import { Category } from '@/lib/core/category';
import { DateOnly } from '@/lib/core/date-only';

export type DisplayedCategory = {
  value: string;
  label: string;
};

export type CreateActivityParams = {
  startTime: Date;
  endTime: Date;
  category: { id: string; name: string };
};

export type ActivityFilters = {
  date?: DateOnly;
  category?: Category;
};
