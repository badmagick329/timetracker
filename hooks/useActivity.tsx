import { useEffect, useState } from 'react';
import { Category } from '@/lib/core/category';
import { useActivityStore } from '@/store/useActivityStore';

export function useActivity() {
  const [selectedCategory, setSelectedCategory] = useState<
    Category | undefined
  >(undefined);

  const createActivity = useActivityStore((state) => state.createActivity);
  const lastCompletedActivity = useActivityStore(
    (state) => state.lastCompletedActivity
  );
  const completeActivity = useActivityStore((state) => state.completeActivity);
  const activityInProgress = useActivityStore(
    (state) => state.activityInProgress
  );
  const isInitialized = useActivityStore((state) => state.isInitialized);

  return {
    canStart:
      isInitialized &&
      activityInProgress === undefined &&
      selectedCategory !== undefined,
    canEnd: isInitialized && activityInProgress !== undefined,
    canEndFromPreviousActivity:
      isInitialized &&
      activityInProgress === undefined &&
      lastCompletedActivity !== undefined &&
      selectedCategory !== undefined,
    createActivity,
    completeActivity,
    selectedCategory,
    setSelectedCategory,
    lastCompletedActivity,
    activityInProgress,
  };
}
