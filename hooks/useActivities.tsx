import { Activity } from '@/lib/core/activity';
import { ActivityManager } from '@/lib/core/activity-manager';
import { Category } from '@/lib/core/category';
import { DateOnly } from '@/lib/core/date-only';
import { Timespan } from '@/lib/core/timespan';
import { ActivitiesJsonStorage } from '@/lib/data/activities-json-storage';
import { CreateActivityParams } from '@/lib/types';
import { useEffect, useState } from 'react';

class ActivityManagerSingleton {
  private static instance: ActivityManager | null = null;
  private static initializationPromise: Promise<ActivityManager> | null = null;

  static async getInstance(): Promise<ActivityManager> {
    if (this.instance) {
      return this.instance;
    }

    if (!this.initializationPromise) {
      this.initializationPromise = this.initialize();
    }

    return this.initializationPromise;
  }

  private static async initialize(): Promise<ActivityManager> {
    const storage = await ActivitiesJsonStorage.create();
    const manager = new ActivityManager(storage);
    this.instance = manager;
    return manager;
  }
}

export function useActivities() {
  const [activityManager, setActivityManager] =
    useState<ActivityManager | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const initManager = async () => {
      try {
        const manager = await ActivityManagerSingleton.getInstance();
        if (isMounted) {
          setActivityManager(manager);
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Failed to initialize activity manager:', error);
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    initManager();

    return () => {
      isMounted = false;
    };
  }, []);

  const createActivity = async ({
    startTime,
    endTime,
    category,
  }: CreateActivityParams): Promise<Activity | null> => {
    if (activityManager === null) return null;

    const logicalDate = new DateOnly(startTime);
    const timespan = Timespan.create(startTime, endTime, logicalDate);
    const categoryObj = Category.create(category);
    const activity = new Activity(timespan, categoryObj);
    activityManager.addActivity(activity);
    return activity;
  };

  const getActivities = async (filters?: {
    date?: DateOnly;
    category?: Category;
  }): Promise<Activity[] | null> => {
    if (activityManager === null) return null;
    return activityManager.getActivities(filters);
  };

  return {
    createActivity,
    getActivities,
  };
}
