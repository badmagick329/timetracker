import { useEffect, useState } from 'react';
import { View } from 'react-native';
import { Category } from '@/lib/core/category';
import { DisplayedCategory } from '@/lib/types';
import { CategoryPicker } from '@/components/home/CategoryPicker';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { useActivityStore } from '@/store/useActivityStore';
import { useCategoryStore } from '@/store/useCategoryStore';

export function CurrentActivityControl() {
  const [ioInProgress, setIoInProgress] = useState(false);
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

  const categories = useCategoryStore((state) => state.categories);
  const getCategory = useCategoryStore((state) => state.getCategory);

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

  const handleStart = async () => {
    if (!canStart) {
      console.log('Cannot start timer');
      return;
    }

    console.log(`Starting ${selectedCategory}`);

    try {
      setIoInProgress(true);
      await createActivity({
        startTime: new Date(),
        endTime: undefined,
        category: selectedCategory!,
      });
    } finally {
      setIoInProgress(false);
    }
  };

  const onCategoryValueChange = (option?: DisplayedCategory) => {
    if (!option?.value) {
      console.log(`category with ${option?.value} not found`);
      return;
    }
    const foundCategory = getCategory(option.value);
    setSelectedCategory(foundCategory);
  };

  const handleEnd = async (customStart?: Date) => {
    if (customStart) {
      try {
        setIoInProgress(true);
        await createActivity({
          startTime: customStart,
          endTime: new Date(),
          category: selectedCategory!,
        });
        setSelectedCategory(undefined);
      } finally {
        setIoInProgress(false);
      }
      return;
    }

    if (activityInProgress === undefined) {
      console.log('No activity in progress');
      return;
    }

    try {
      setIoInProgress(true);
      await completeActivity(new Date());
      setSelectedCategory(undefined);
    } finally {
      setIoInProgress(false);
    }
  };

  const handleEndFromLastActivity = async () => {
    if (lastCompletedActivity && lastCompletedActivity.end) {
      console.log('Last Activity:', lastCompletedActivity);
      await handleEnd(lastCompletedActivity.end);
    } else {
      console.log('No last activity found or start time is undefined');
      await handleEnd();
    }
  };

  const displayedCategories = categories.map((c) => ({
    value: c.id,
    label: c.name,
  }));

  return (
    <View className='flex w-full flex-col gap-12'>
      <View className='flex w-full flex-row items-center justify-center gap-4'>
        <CategoryPicker
          displayedCategories={displayedCategories}
          onValueChange={onCategoryValueChange}
          selectedCategory={selectedCategory}
        />
        <Button
          className='w-24'
          disabled={!canStart || ioInProgress}
          onPress={handleStart}
        >
          <Text>Start</Text>
        </Button>
      </View>
      <View className='flex w-full flex-row items-center justify-center gap-8'>
        <Button
          className='w-24'
          variant={'destructive'}
          disabled={!canEnd || ioInProgress}
          onPress={() => handleEnd()}
        >
          <Text>End</Text>
        </Button>
        <Button
          className='w-72'
          variant={'accent'}
          disabled={!canEndFromPreviousActivity || ioInProgress}
          onPress={handleEndFromLastActivity}
        >
          <Text>End from last activity</Text>
        </Button>
      </View>
    </View>
  );
}
