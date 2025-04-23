import { Activity } from './activity';
import { Category } from './category';
import { DateOnly } from './date-only';
import { IActivitiesStorage } from './iactivities-storage';

type ActivityFilters = {
  date?: DateOnly;
  category?: Category;
};

export class ActivityManager implements IActivitiesStorage {
  private storage: IActivitiesStorage;

  constructor(storage: IActivitiesStorage) {
    this.storage = storage;
  }

  get activities() {
    return this.storage.activities;
  }

  public async addActivity(activity: Activity): Promise<string> {
    return await this.storage.addActivity(activity);
  }

  public async removeActivity(activityId: string): Promise<string | undefined> {
    return await this.storage.removeActivity(activityId);
  }
  updateActivity(activity: Activity): Promise<boolean> {
    throw new Error('Method not implemented.');
  }

  public getActivities(filters?: ActivityFilters): Activity[] {
    if (!filters) {
      return this.storage.activities;
    }

    let filteredActivities = this.storage.activities;

    if (filters.date !== undefined) {
      filteredActivities = filteredActivities.filter((activity) =>
        activity.logicalDate.equals(filters.date!)
      );
    }

    if (filters.category !== undefined) {
      filteredActivities = filteredActivities.filter((activity) =>
        activity.category.equals(filters.category!)
      );
    }

    return filteredActivities;
  }

  public static groupByLogicalDate(activities: Activity[]) {
    const grouped: { [key: string]: Activity[] } = {};

    activities.forEach((activity) => {
      const dateKey = activity.logicalDate.toString();
      if (!grouped[dateKey]) {
        grouped[dateKey] = [];
      }
      grouped[dateKey].push(activity);
    });

    return grouped;
  }

  public getTotalDuration(filters?: ActivityFilters): number {
    return this.getActivities(filters).reduce(
      (total, activity) => total + activity.duration,
      0
    );
  }
}
