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
  activityInProgress: Activity | undefined;
  isLoading: boolean;
  isInitialized: boolean;
  error: string | null;
};

type ActivityActions = {
  initialize: () => Promise<void>;
  createActivity: (
    params: CreateActivityParams
  ) => Promise<Activity | undefined>;
  completeActivity: (endTime: Date) => Promise<string | undefined>;
  removeActivity: (activity: Activity) => Promise<string | undefined>;
  getLastCompletedActivity: () => Activity | undefined;
  resetAll: () => Promise<void>;
  groupByLogicalDate: () => { [key: string]: Activity[] } | undefined;
};

const initialState: ActivityState = {
  activityManager: undefined,
  activities: [],
  activityInProgress: undefined,
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
          activityInProgress: manager.activityInProgress,
          isLoading: false,
          isInitialized: true,
          error: null,
        });
      } catch (err) {
        console.log('Failed to initialize activity manager:', err);
        set({
          activityManager: undefined,
          activities: [],
          activityInProgress: undefined,
          isLoading: false,
          isInitialized: true,
          error:
            err instanceof Error ? err.message : 'Unknown initialization error',
        });
      }
    },

    createActivity: async ({ startTime, category, endTime }) => {
      const { activityManager } = get();
      if (!activityManager) {
        console.log(
          'Cannot create activity: Activity Manager not initialized.'
        );
        return undefined;
      }

      try {
        const logicalDate = new DateOnly(startTime);
        const activity = new Activity({
          timespan: Timespan.create(startTime, logicalDate, endTime),
          category: Category.create(category.name, category.id),
        });
        await activityManager.addActivity(activity);
        console.log('Activity added:', activity);

        set({
          activities: [...activityManager.getActivities()],
          activityInProgress: activityManager.activityInProgress,
        });
        return activity;
      } catch (error) {
        console.log('Failed to create activity:', error);
        return undefined;
      }
    },

    completeActivity: async (endTime: Date) => {
      const { activityManager } = get();
      if (!activityManager) {
        console.log(
          'Cannot complete activity: Activity Manager not initialized.'
        );
        return undefined;
      }

      const completedId = await activityManager.completeActivity(endTime);
      set({
        activityInProgress: activityManager.activityInProgress,
      });
      return completedId;
    },

    removeActivity: async (activity: Activity) => {
      const { activityManager } = get();
      if (!activityManager) {
        console.log(
          'Cannot remove activity: Activity Manager not initialized.'
        );
        return undefined;
      }
      try {
        const removed = await activityManager.removeActivity(
          activity.toString()
        );
        if (removed) {
          set({
            activities: [...activityManager.getActivities()],
            activityInProgress: activityManager.activityInProgress,
          });
        }
        return activity.toString();
      } catch (error) {
        console.log('Failed to remove activity:', error);
        return undefined;
      }
    },

    getLastCompletedActivity: () => {
      const { activityManager } = get();
      if (!activityManager) {
        console.log(
          'Cannot get last activity: Activity Manager not initialized.'
        );
        return undefined;
      }

      return activityManager.getLastCompletedActivity();
    },

    resetAll: async () => {
      const { activityManager } = get();
      if (!activityManager) {
        console.log(
          'Cannot reset activities: Activity Manager not initialized.'
        );
        return undefined;
      }

      await activityManager.resetAll();
      set({
        activities: [...activityManager.getActivities()],
        activityInProgress: activityManager.activityInProgress,
      });
    },
    groupByLogicalDate: () => {
      const { activityManager } = get();
      if (!activityManager) {
        console.log(
          'Cannot group activities: Activity Manager not initialized.'
        );
        return undefined;
      }

      return activityManager.groupByLogicalDate();
    },
  }))
);
