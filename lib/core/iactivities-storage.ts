import { Activity } from './activity';

export interface IActivitiesStorage {
  activities: Activity[];
  addActivity(activity: Activity): Promise<void>;
  removeActivity(activityId: string): Promise<boolean>;
  updateActivity(activity: Activity): Promise<boolean>;
}
