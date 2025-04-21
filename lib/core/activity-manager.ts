import { Activity } from './activity';
import { Category } from './category';
import { DateOnly } from './date-only';
import { IActivitiesStorage } from './iactivities-storage';

type ActivityFilters = {
  date?: DateOnly;
  category?: Category;
};

export class ActivityManager {
  private storage: IActivitiesStorage;

  constructor(storage: IActivitiesStorage) {
    this.storage = storage;
  }

  public async addActivity(activity: Activity): Promise<void> {
    await this.storage.addActivity(activity);
    console.log('Activity added:', activity);
  }

  public async removeActivity(activity: Activity): Promise<boolean> {
    return await this.storage.removeActivity(activity.toString());
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
