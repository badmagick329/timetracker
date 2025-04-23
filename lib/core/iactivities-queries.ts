import { ActivityFilters } from '@/lib/types';
import { Activity } from './activity';

export interface IActivitiesQueries {
  getActivities(filters?: ActivityFilters): Activity[];
  getTotalDuration(filters?: ActivityFilters): number;
  groupByLogicalDate(): { [key: string]: Activity[] };
}
