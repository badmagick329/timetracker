import { Activity } from './activity';

export interface IActivitiesRepository {
  activities: Activity[];
  addActivity(activity: Activity): Promise<string>;
  removeActivity(activityId: string): Promise<string | undefined>;
  updateActivity(activity: Activity): Promise<boolean>;
  resetAll(): Promise<void>;
}
