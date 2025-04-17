import { Activity } from './activity';
import { Category } from './category';
import { DateOnly } from './date-only';

export class ActivityManager {
  private activities: Activity[] = [];

  public addActivity(activity: Activity): void {
    this.activities.push(activity);
  }

  public removeActivity(activity: Activity): boolean {
    const index = this.activities.indexOf(activity);
    if (index !== -1) {
      this.activities.splice(index, 1);
      return true;
    }
    return false;
  }

  public getActivitiesByDate(date: DateOnly): Activity[] {
    return this.activities.filter((activity) =>
      activity.logicalDate.equals(date)
    );
  }

  public getActivitiesByCategory(category: Category): Activity[] {
    return this.activities.filter((activity) =>
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
