import { create } from 'zustand';
import { combine } from 'zustand/middleware';
import { Activity } from '@/lib/core/activity';
import { ActivityManager } from '@/lib/core/activity-manager';
import { Category } from '@/lib/core/category';
import { DateOnly } from '@/lib/core/date-only';
import { Timespan } from '@/lib/core/timespan';
import { ActivitiesJsonStorage } from '@/lib/data/activities-json-storage';
import { CreateActivityParams } from '@/lib/types';

type ActivityState = {
  activityManager: ActivityManager | undefined;
  activities: Activity[];
  isLoading: boolean;
  isInitialized: boolean;
  error: string | null;
};

type ActivityActions = {
  initialize: () => Promise<void>;
  createActivity: (
    params: CreateActivityParams
  ) => Promise<Activity | undefined>;
  removeActivity: (activity: Activity) => Promise<boolean>;
};

const initialState: ActivityState = {
  activityManager: undefined,
  activities: [],
  isLoading: false,
  isInitialized: false,
  error: null,
};

export const useActivityStore = create(
  combine<ActivityState, ActivityActions>(initialState, (set, get) => ({
    initialize: async () => {
      if (get().isInitialized || get().isLoading) {
        return;
      }

      set({ isLoading: true, error: null });

      try {
        const storage = await ActivitiesJsonStorage.create();
        const manager = new ActivityManager(storage);

        set({
          activityManager: manager,
          activities: manager.getActivities(),
          isLoading: false,
          isInitialized: true,
          error: null,
        });
      } catch (err) {
        console.error('Failed to initialize activity manager:', err);
        set({
          activityManager: undefined,
          activities: [],
          isLoading: false,
          isInitialized: true,
          error:
            err instanceof Error ? err.message : 'Unknown initialization error',
        });
      }
    },

    createActivity: async ({ startTime, endTime, category }) => {
      const { activityManager } = get();
      if (!activityManager) {
        console.error(
          'Cannot create activity: Activity Manager not initialized.'
        );
        return undefined;
      }

      try {
        const logicalDate = new DateOnly(startTime);
        const timespan = Timespan.create(startTime, endTime, logicalDate);
        const categoryObj = Category.create(category);
        const activity = new Activity(timespan, categoryObj);
        await activityManager.addActivity(activity);

        set({ activities: [...activityManager.getActivities()] });
        return activity;
      } catch (error) {
        console.error('Failed to create activity:', error);
        return undefined;
      }
    },

    removeActivity: async (activity: Activity) => {
      const { activityManager } = get();
      if (!activityManager) {
        console.error(
          'Cannot remove activity: Activity Manager not initialized.'
        );
        return false;
      }
      try {
        const removed = await activityManager.removeActivity(activity);
        if (removed) {
          set({ activities: [...activityManager.getActivities()] });
        }
        return removed;
      } catch (error) {
        console.error('Failed to remove activity:', error);
        return false;
      }
    },
  }))
);
