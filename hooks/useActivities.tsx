import { Activity } from '@/lib/core/activity';
import { ActivityManager } from '@/lib/core/activity-manager';
import { Category } from '@/lib/core/category';
import { DateOnly } from '@/lib/core/date-only';
import { Timespan } from '@/lib/core/timespan';
import { CreateActivityParams } from '@/lib/types';

const activityManager = new ActivityManager();

export function useActivities() {
  const createActivity = ({
    startTime,
    endTime,
    category,
  }: CreateActivityParams): Activity => {
    const logicalDate = new DateOnly(startTime);
    const timespan = Timespan.create(startTime, endTime, logicalDate);
    const categoryObj = Category.create(category);
    const activity = new Activity(timespan, categoryObj);
    activityManager.addActivity(activity);
    return activity;
  };

  const getActivities = (filters: { date?: DateOnly; category?: Category }) => {
    return activityManager.getActivities(filters);
  };

  return {
    createActivity,
    getActivities,
  };
}
