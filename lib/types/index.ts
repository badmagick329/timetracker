import { Category } from '@/lib/core/category';
import { DateOnly } from '@/lib/core/date-only';
import { TimeOnly } from '@/lib/core/time-only';

export type DisplayedCategory = {
  value: string;
  label: string;
};

export type CreateActivityParams = {
  startTime: Date;
  category: { id: string; name: string };
  endTime?: Date;
};

export type ActivityFilters = {
  date?: DateOnly;
  category?: Category;
  completedOnly?: boolean;
};

export type JsonParsedActivity = {
  id: string;
  timespan: {
    start: string;
    logicalDate: string;
    end: string;
  };
  category: { id: string; name: string };
  summary: string;
};

export type AppSettingsParams = {
  logicalDateCutOff?: TimeOnly;
};
