import { ActivityFilters } from '@/lib/types';
import { Activity } from './activity';
import { IActivitiesRepository } from './iactivities-repository';
import { IActivitiesQueries } from './iactivities-queries';

export class ActivityManager
  implements IActivitiesRepository, IActivitiesQueries
{
  private storage: IActivitiesRepository;

  constructor(storage: IActivitiesRepository) {
    this.storage = storage;
  }

  get activities() {
    return this.storage.activities;
  }

  async addActivity(activity: Activity): Promise<string> {
    return await this.storage.addActivity(activity);
  }

  async removeActivity(activityId: string): Promise<string | undefined> {
    return await this.storage.removeActivity(activityId);
  }
  updateActivity(activity: Activity): Promise<boolean> {
    throw new Error('Method not implemented.');
  }

  getLastActivity(): Activity | undefined {
    return this.storage.getLastActivity();
  }

  async resetAll(): Promise<void> {
    await this.storage.resetAll();
  }

  getActivities(filters?: ActivityFilters): Activity[] {
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

  groupByLogicalDate() {
    const grouped: { [key: string]: Activity[] } = {};

    this.storage.activities.forEach((activity) => {
      const dateKey = activity.logicalDate.toString();
      if (!grouped[dateKey]) {
        grouped[dateKey] = [];
      }
      grouped[dateKey].push(activity);
    });

    return grouped;
  }

  getTotalDuration(filters?: ActivityFilters): number {
    return this.getActivities(filters).reduce(
      (total, activity) => total + activity.duration,
      0
    );
  }
}
