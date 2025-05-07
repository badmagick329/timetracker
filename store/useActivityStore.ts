import { create } from 'zustand';
import { combine } from 'zustand/middleware';
import { Activity } from '@/lib/core/activity';
import { ActivityManager } from '@/lib/core/activity-manager';
import { Category } from '@/lib/core/category';
import { DateOnly } from '@/lib/core/date-only';
import { IActivitiesRepository } from '@/lib/core/iactivities-repository';
import { TimeOnly } from '@/lib/core/time-only';
import { Timespan } from '@/lib/core/timespan';
import { CreateActivityParams } from '@/lib/types';

type ActivityState = {
  activityManager: ActivityManager | undefined;
  activities: Activity[];
  activityInProgress: Activity | undefined;
  lastCompletedActivity: Activity | undefined;
  activitiesByDate: { [key: string]: Activity[] };
  isLoading: boolean;
  isInitialized: boolean;
  error: string | null;
};

type ActivityActions = {
  initialize: (respository: IActivitiesRepository) => Promise<void>;
  createActivity: (
    params: CreateActivityParams
  ) => Promise<Activity | undefined>;
  completeActivity: (endTime: Date) => Promise<string | undefined>;
  updateActivity: (activity: Activity) => Promise<boolean | undefined>;
  removeActivity: (activity: Activity) => Promise<string | undefined>;
  resetAll: () => Promise<void>;
};

const initialState: ActivityState = {
  activityManager: undefined,
  activities: [],
  activityInProgress: undefined,
  activitiesByDate: {},
  lastCompletedActivity: undefined,
  isLoading: false,
  isInitialized: false,
  error: null,
};

export const useActivityStore = create(
  combine<ActivityState, ActivityActions>(initialState, (set, get) => ({
    initialize: async (respository: IActivitiesRepository) => {
      if (get().isInitialized || get().isLoading) {
        return;
      }

      set({ isLoading: true, error: null });

      try {
        const manager = new ActivityManager(respository);

        set({
          activityManager: manager,
          activities: manager.getActivities(),
          lastCompletedActivity: manager.getLastCompletedActivity(),
          activityInProgress: manager.activityInProgress,
          activitiesByDate: manager.groupByLogicalDate(),
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
          activitiesByDate: {},
          lastCompletedActivity: undefined,
          isLoading: false,
          isInitialized: true,
          error:
            err instanceof Error ? err.message : 'Unknown initialization error',
        });
      }
    },

    createActivity: async ({
      startTime,
      category,
      endTime,
      logicalDateCutOff,
    }) => {
      const { activityManager: manager } = get();
      if (!manager) {
        console.log(
          'Cannot create activity: Activity Manager not initialized.'
        );
        return undefined;
      }

      try {
        const logicalDate =
          TimeOnly.fromDate(startTime) < logicalDateCutOff
            ? DateOnly.addDays(startTime, -1)
            : new DateOnly(startTime);

        const activity = new Activity({
          timespan: Timespan.create(startTime, logicalDate, endTime),
          category: Category.create(category.name, category.id),
        });
        await manager.addActivity(activity);
        console.log('Activity added:', activity);

        set({
          activities: [...manager.getActivities()],
          activityInProgress: manager.activityInProgress,
          lastCompletedActivity: manager.getLastCompletedActivity(),
          activitiesByDate: manager.groupByLogicalDate(),
        });
        return activity;
      } catch (error) {
        console.log('Failed to create activity:', error);
        return undefined;
      }
    },

    completeActivity: async (endTime: Date) => {
      const { activityManager: manager } = get();
      if (!manager) {
        console.log(
          'Cannot complete activity: Activity Manager not initialized.'
        );
        return undefined;
      }

      const completedId = await manager.completeActivity(endTime);
      set({
        activityInProgress: manager.activityInProgress,
        lastCompletedActivity: manager.getLastCompletedActivity(),
        activitiesByDate: manager.groupByLogicalDate(),
      });
      return completedId;
    },

    updateActivity: async (
      activity: Activity
    ): Promise<boolean | undefined> => {
      const { activityManager: manager } = get();
      if (!manager) {
        console.log(
          'Cannot update activity: Activity Manager not initialized.'
        );
        return undefined;
      }

      try {
        const isUpdated = await manager.updateActivity(activity);
        if (isUpdated) {
          set({
            activities: [...manager.getActivities()],
            activityInProgress: manager.activityInProgress,
            lastCompletedActivity: manager.getLastCompletedActivity(),
            activitiesByDate: manager.groupByLogicalDate(),
          });
        }
        return isUpdated;
      } catch (error) {
        console.log('Failed to update activity:', error);
        return undefined;
      }
    },

    removeActivity: async (activity: Activity) => {
      const { activityManager: manager } = get();
      if (!manager) {
        console.log(
          'Cannot remove activity: Activity Manager not initialized.'
        );
        return undefined;
      }
      try {
        const removed = await manager.removeActivity(activity.toString());
        if (removed) {
          set({
            activities: [...manager.getActivities()],
            activityInProgress: manager.activityInProgress,
            lastCompletedActivity: manager.getLastCompletedActivity(),
            activitiesByDate: manager.groupByLogicalDate(),
          });
        }
        return activity.toString();
      } catch (error) {
        console.log('Failed to remove activity:', error);
        return undefined;
      }
    },

    resetAll: async () => {
      const { activityManager: manager } = get();
      if (!manager) {
        console.log(
          'Cannot reset activities: Activity Manager not initialized.'
        );
        return undefined;
      }

      await manager.resetAll();
      set({
        activities: [...manager.getActivities()],
        activityInProgress: manager.activityInProgress,
        activitiesByDate: manager.groupByLogicalDate(),
      });
    },
  }))
);
