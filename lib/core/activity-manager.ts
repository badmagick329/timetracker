import { ActivityFilters } from '@/lib/types';
import { Activity } from './activity';
import { IActivitiesOperations } from './iactivities-operations';
import { IActivitiesRepository } from './iactivities-repository';

export class ActivityManager
  implements IActivitiesRepository, IActivitiesOperations
{
  private storage: IActivitiesRepository;
  private _activityInProgress: Activity | undefined;

  constructor(storage: IActivitiesRepository) {
    this.storage = storage;
    const activitiesInProgress = this.activities.filter((a) => a.isInProgress);
    if (activitiesInProgress.length > 1) {
      console.error(
        'More than one activity in progress:',
        activitiesInProgress
      );
      throw new Error('Multiple activities in progress detected.');
    }

    this._activityInProgress =
      activitiesInProgress.length === 1 ? activitiesInProgress[0] : undefined;
  }

  get activities() {
    return this.storage.activities;
  }

  get activityInProgress() {
    return this._activityInProgress;
  }

  async addActivity(activity: Activity): Promise<string> {
    if (this.activityInProgress !== undefined) {
      console.error('Activity already in progress:', this.activityInProgress);
      throw new Error(
        'Cannot add a new activity while another is in progress.'
      );
    }
    const createdId = await this.storage.addActivity(activity);
    if (activity.end === undefined) {
      this._activityInProgress = activity;
    }
    return createdId;
  }

  async completeActivity(endTime: Date): Promise<string> {
    if (this.activityInProgress === undefined) {
      console.error('No activity in progress to complete.');
      throw new Error('No activity in progress to complete.');
    }
    if (this.activityInProgress.id === undefined) {
      console.error('Activity ID is undefined:', this.activityInProgress);
      throw new Error('Activity ID is undefined.');
    }

    this.activityInProgress.completeActivity(endTime);
    await this.updateActivity(this.activityInProgress);

    const activityId = this.activityInProgress.id;
    this._activityInProgress = undefined;
    return activityId;
  }

  async removeActivity(activityId: string): Promise<string | undefined> {
    const removedId = await this.storage.removeActivity(activityId);
    const activityInProgressWasRemoved =
      this.activityInProgress &&
      removedId &&
      this.activityInProgress.id === removedId;

    if (activityInProgressWasRemoved) {
      this._activityInProgress = undefined;
    }
    return removedId;
  }

  updateActivity(activity: Activity): Promise<boolean> {
    return this.storage.updateActivity(activity);
  }

  getLastCompletedActivity(): Activity | undefined {
    const completedActivities = this.activities.filter((a) => !a.isInProgress);
    if (completedActivities.length === 0) {
      return undefined;
    }

    return completedActivities.reduce((prev, current) => {
      return prev.end! > current.end! ? prev : current;
    });
  }

  async resetAll(): Promise<void> {
    await this.storage.resetAll();
    this._activityInProgress = undefined;
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

    if (filters.completedOnly) {
      filteredActivities = filteredActivities.filter(
        (activity) => !activity.isInProgress
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
      (total, activity) => total + activity.duration!,
      0
    );
  }
}
