import { ActivityFilters } from '@/lib/types';
import { Activity } from './activity';

export interface IActivitiesOperations {
  getActivities(filters?: ActivityFilters): Activity[];
  getTotalDuration(filters?: ActivityFilters): number;
  groupByLogicalDate(): { [key: string]: Activity[] };
  getLastCompletedActivity(): Activity | undefined;
  completeActivity(endTime: Date): Promise<string>;
}
