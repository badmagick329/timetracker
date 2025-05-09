import { useActivity } from '@/hooks/useActivity';
import { useState } from 'react';
import { View } from 'react-native';
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

    console.log('Last Activity:', lastCompletedActivity);
    await handleEnd({
      customStart: lastCompletedActivity?.end,
      logicalDateCutOff,
    });
  };

  const handleStartFromLastActivity = async () => {
    if (!logicalDateCutOff) {
      console.log('No logicalDateCutOff found');
      return;
    }

    console.log('Last Activity:', lastCompletedActivity);
    await handleStart({
      customStart: lastCompletedActivity?.end,
      logicalDateCutOff,
    });
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
      <View className='flex w-full flex-row items-center justify-between gap-8 px-8'>
        <Button
          className='w-64'
          disabled={!canStart || ioInProgress || !logicalDateCutOff}
          onPress={handleStartFromLastActivity}
        >
          <Text>Start from last activity</Text>
        </Button>
        <View>
          {!canEnd ? (
            <Button
              className='w-24'
              disabled={!canStart || ioInProgress || !logicalDateCutOff}
              onPress={async () => {
                if (!logicalDateCutOff) {
                  return;
                }
                await handleStart({ logicalDateCutOff });
              }}
            >
              <Text>Start</Text>
            </Button>
          ) : (
            <Button
              className='w-24'
              variant='destructive'
              disabled={!canEnd || ioInProgress || !logicalDateCutOff}
              onPress={async () => {
                if (!logicalDateCutOff) {
                  return;
                }
                await handleEnd({ logicalDateCutOff });
              }}
            >
              <Text>End</Text>
            </Button>
          )}
        </View>
      </View>
      <View className='flex w-full flex-row items-center justify-start gap-8 px-8'>
        <Button
          className='w-64'
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
      const start = performance.now();
      await completeActivity(new Date());
      setSelectedCategory(undefined);
      console.log(
        `[CurrentActivityControl] - completeActivity took ${performance.now() - start} milliseconds`
      );
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
  return async ({
    customStart,
    logicalDateCutOff,
  }: {
    customStart?: Date;
    logicalDateCutOff: TimeOnly;
  }) => {
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
      const start = performance.now();
      await createActivity({
        startTime: customStart || new Date(),
        endTime: undefined,
        category: selectedCategory,
        logicalDateCutOff,
      });
      console.log(
        `[CurrentActivityControl] - Create activity took ${performance.now() - start} milliseconds`
      );
    } finally {
      setIoInProgress(false);
    }
  };
}

export function CurrentActivityControlAnimated() {
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

    console.log('Last Activity:', lastCompletedActivity);
    await handleEnd({
      customStart: lastCompletedActivity?.end,
      logicalDateCutOff,
    });
  };

  const handleStartFromLastActivity = async () => {
    if (!logicalDateCutOff) {
      console.log('No logicalDateCutOff found');
      return;
    }

    console.log('Last Activity:', lastCompletedActivity);
    const start = performance.now();
    await handleStart({
      customStart: lastCompletedActivity?.end,
      logicalDateCutOff,
    });
    console.log(`Saving took ${performance.now() - start} milliseconds`);
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
      <View className='flex w-full flex-row items-center justify-between gap-8 px-8'>
        <Button
          className='w-64'
          disabled={!canStart || ioInProgress || !logicalDateCutOff}
          onPress={handleStartFromLastActivity}
        >
          <Text>Start from last activity</Text>
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
                logicalDateCutOff && handleStart({ logicalDateCutOff })
              }
            >
              <Text>Start</Text>
            </Button>
          ) : (
            <Button
              className='w-24'
              variant='destructive'
              disabled={!canEnd || ioInProgress || !logicalDateCutOff}
              onPress={() => {
                if (!logicalDateCutOff) {
                  return;
                }
                const start = performance.now();
                handleEnd({ logicalDateCutOff });
                console.log(
                  `Saving took ${performance.now() - start} milliseconds`
                );
              }}
            >
              <Text>End</Text>
            </Button>
          )}
        </Animated.View>
      </View>
      <View className='flex w-full flex-row items-center justify-start gap-8 px-8'>
        <Button
          className='w-64'
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
