import { Activity } from './activity';
import { Category } from './category';
import { DateOnly } from './date-only';
import { IActivitiesStorage } from './iactivities-storage';

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

  public getActivities(filters?: {
    date?: DateOnly;
    category?: Category;
  }): Activity[] {
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

  public getActivitiesByDate(date: DateOnly): Activity[] {
    return this.storage.activities.filter((activity) =>
      activity.logicalDate.equals(date)
    );
  }

  public getActivitiesByCategory(category: Category): Activity[] {
    return this.storage.activities.filter((activity) =>
      activity.category.equals(category)
    );
  }

  public getTotalDurationByDate(date: DateOnly): number {
    return this.getActivitiesByDate(date).reduce(
      (total, activity) => total + activity.duration,
      0
    );
  }

  public getTotalDurationByCategory(category: Category): number {
    return this.getActivitiesByCategory(category).reduce(
      (total, activity) => total + activity.duration,
      0
    );
  }
}
