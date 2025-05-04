import { useActivity } from '@/hooks/useActivity';
import { useState } from 'react';
import { View } from 'react-native';
import { StyleSheet } from 'react-native';
import Animated, { LinearTransition } from 'react-native-reanimated';
import { Activity } from '@/lib/core/activity';
import { Category } from '@/lib/core/category';
import { TimeOnly } from '@/lib/core/time-only';
import { CreateActivityParams, DisplayedCategory } from '@/lib/types';
import { CategoryPicker } from '@/components/home/CategoryPicker';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { useAppSettingsStore } from '@/store/useAppSettingsStore';
import { useCategoryStore } from '@/store/useCategoryStore';

export function CurrentActivityControl() {
  const [ioInProgress, setIoInProgress] = useState(false);
  const categories = useCategoryStore((state) => state.categories);
  const getCategory = useCategoryStore((state) => state.getCategory);

  const logicalDateCutOff = useAppSettingsStore(
    (state) => state.appSettings?.logicalDateCutOff
  );

  const {
    canStart,
    canEnd,
    canEndFromPreviousActivity,
    selectedCategory,
    setSelectedCategory,
    createActivity,
    completeActivity,
    lastCompletedActivity,
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
    if (!logicalDateCutOff) {
      console.log('No logicalDateCutOff found');
      return;
    }
    if (
      lastCompletedActivity &&
      lastCompletedActivity.end &&
      logicalDateCutOff
    ) {
      console.log('Last Activity:', lastCompletedActivity);
      await handleEnd({
        customStart: lastCompletedActivity.end,
        logicalDateCutOff,
      });
    } else {
      console.log('No last activity found or start time is undefined');
      await handleEnd({ logicalDateCutOff });
    }
  };

  const displayedCategories = categories.map((c) => ({
    value: c.id,
    label: c.name,
  }));

  return (
    <View className='flex w-full flex-col gap-4'>
      <View className='flex w-full flex-row items-center justify-center gap-4 px-8'>
        <CategoryPicker
          displayedCategories={displayedCategories}
          onValueChange={onCategoryValueChange}
          selectedCategory={selectedCategory}
        />
      </View>
      <View className='flex w-full flex-row items-center justify-center gap-8 px-8'>
        <Button
          className='w-72'
          variant={'accent'}
          disabled={!canEndFromPreviousActivity || ioInProgress}
          onPress={handleEndFromLastActivity}
        >
          <Text>End from last activity</Text>
        </Button>
        <Animated.View
          layout={LinearTransition.springify()}
          collapsable={false}
        >
          {!canEnd ? (
            <Button
              className='w-24'
              disabled={!canStart || ioInProgress || !logicalDateCutOff}
              onPress={() =>
                logicalDateCutOff && handleStart(logicalDateCutOff)
              }
            >
              <Text>Start</Text>
            </Button>
          ) : (
            <Button
              className='w-24'
              variant='destructive'
              disabled={!canEnd || ioInProgress || !logicalDateCutOff}
              onPress={() =>
                logicalDateCutOff && handleEnd({ logicalDateCutOff })
              }
            >
              <Text>End</Text>
            </Button>
          )}
        </Animated.View>
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
  return async ({
    logicalDateCutOff,
    customStart,
  }: {
    logicalDateCutOff: TimeOnly;
    customStart?: Date;
  }) => {
    if (customStart) {
      try {
        setIoInProgress(true);
        await createActivity({
          startTime: customStart,
          endTime: new Date(),
          category: selectedCategory!,
          logicalDateCutOff,
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
) {
  return async (logicalDateCutOff: TimeOnly) => {
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
        logicalDateCutOff,
      });
    } finally {
      setIoInProgress(false);
    }
  };
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'red',
    paddingVertical: 15,
    marginVertical: 10,
    borderRadius: 10,
    width: 200,
  },
});
