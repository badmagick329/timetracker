import { useActivity } from '@/hooks/useActivity';
import { useState } from 'react';
import { View } from 'react-native';
import { Activity } from '@/lib/core/activity';
import { Category } from '@/lib/core/category';
import { CreateActivityParams, DisplayedCategory } from '@/lib/types';
import { CategoryPicker } from '@/components/home/CategoryPicker';
import { MorphingButton } from '@/components/ui/MorphingButton';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { useCategoryStore } from '@/store/useCategoryStore';

export function CurrentActivityControl() {
  const [ioInProgress, setIoInProgress] = useState(false);
  const categories = useCategoryStore((state) => state.categories);
  const getCategory = useCategoryStore((state) => state.getCategory);

  const {
    canStart,
    canEnd,
    canEndFromPreviousActivity,
    selectedCategory,
    setSelectedCategory,
    createActivity,
    completeActivity,
    lastCompletedActivity,
    activityInProgress,
  } = useActivity();

  const handleStart = initializeActivity(
    canStart,
    selectedCategory,
    setIoInProgress,
    createActivity
  );

  const handleEnd = finalizeActivity(
    setIoInProgress,
    createActivity,
    selectedCategory,
    setSelectedCategory,
    canEnd,
    completeActivity
  );

  const onCategoryValueChange = (option?: DisplayedCategory) => {
    if (!option?.value) {
      console.log(`category with ${option?.value} not found`);
      return;
    }
    const foundCategory = getCategory(option.value);
    setSelectedCategory(foundCategory);
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
        <MorphingButton
          rounded={activityInProgress !== undefined}
          className='w-24'
          disabled={!canStart || ioInProgress}
          onPress={handleStart}
        >
          <Text>Start</Text>
        </MorphingButton>
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

function finalizeActivity(
  setIoInProgress: React.Dispatch<React.SetStateAction<boolean>>,
  createActivity: (
    params: CreateActivityParams
  ) => Promise<Activity | undefined>,
  selectedCategory: Category | undefined,
  setSelectedCategory: React.Dispatch<
    React.SetStateAction<Category | undefined>
  >,
  canEnd: boolean,
  completeActivity: (endTime: Date) => Promise<string | undefined>
) {
  return async (customStart?: Date) => {
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
    if (!canEnd) {
      console.log('Cannot end timer');
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
}

function initializeActivity(
  canStart: boolean,
  selectedCategory: Category | undefined,
  setIoInProgress: React.Dispatch<React.SetStateAction<boolean>>,
  createActivity: (
    params: CreateActivityParams
  ) => Promise<Activity | undefined>
): () => Promise<void> {
  return async () => {
    if (!canStart) {
      console.log('Cannot start timer');
      return;
    }

    if (selectedCategory === undefined) {
      console.log("No selectedCategory? This shouldn't happen");
      return;
    }

    try {
      setIoInProgress(true);
      await createActivity({
        startTime: new Date(),
        endTime: undefined,
        category: selectedCategory,
      });
    } finally {
      setIoInProgress(false);
    }
  };
}
