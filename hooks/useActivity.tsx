import { useEffect, useState } from 'react';
import { Category } from '@/lib/core/category';
import { useActivityStore } from '@/store/useActivityStore';

export function useActivity() {
  const [selectedCategory, setSelectedCategory] = useState<
    Category | undefined
  >(undefined);
  const [canStart, setCanStart] = useState(false);
  const [canEnd, setCanEnd] = useState(false);
  const [canEndFromPreviousActivity, setCanEndFromPreviousActivity] =
    useState(false);

  const createActivity = useActivityStore((state) => state.createActivity);
  const lastCompletedActivity = useActivityStore(
    (state) => state.lastCompletedActivity
  );
  const completeActivity = useActivityStore((state) => state.completeActivity);
  const activityInProgress = useActivityStore(
    (state) => state.activityInProgress
  );
  const isInitialized = useActivityStore((state) => state.isInitialized);
  useEffect(() => {
    setCanStart(
      isInitialized &&
        activityInProgress === undefined &&
        selectedCategory !== undefined
    );
    setCanEnd(isInitialized && activityInProgress !== undefined);
    setCanEndFromPreviousActivity(
      isInitialized &&
        activityInProgress === undefined &&
        lastCompletedActivity !== undefined &&
        selectedCategory !== undefined
    );
  }, [
    isInitialized,
    activityInProgress,
    lastCompletedActivity,
    selectedCategory,
    setSelectedCategory,
  ]);
  return {
    canStart,
    canEnd,
    canEndFromPreviousActivity,
    createActivity,
    completeActivity,
    selectedCategory,
    setSelectedCategory,
    lastCompletedActivity,
  };
}
