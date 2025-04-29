import { useState } from 'react';
import { View } from 'react-native';
import { Category } from '@/lib/core/category';
import { DisplayedCategory } from '@/lib/types';
import { CategoryPicker } from '@/components/home/CategoryPicker';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { useActivityStore } from '@/store/useActivityStore';
import { useCategoryStore } from '@/store/useCategoryStore';
import { useTimerStore } from '@/store/useTimerStore';

export function CurrentActivityControl({
  selectedCategory,
  setSelectedCategory,
}: {
  selectedCategory?: Category;

  setSelectedCategory: React.Dispatch<
    React.SetStateAction<Category | undefined>
  >;
}) {
  const [ioInProgress, setIoInProgress] = useState(false);

  const createActivity = useActivityStore((state) => state.createActivity);
  const getLastActivity = useActivityStore(
    (state) => state.getLastCompletedActivity
  );

  const startTime = useTimerStore((state) => state.startTime);
  const canStart = useTimerStore((state) => state.canStart);
  const canEnd = useTimerStore((state) => state.canEnd);
  const startTimer = useTimerStore((state) => state.startTimer);
  const endTimer = useTimerStore((state) => state.endTimer);
  const handleStart = () => {
    const newTime = startTimer();
    if (newTime) {
      console.log(`Starting ${selectedCategory}`);
    }
  };

  const categories = useCategoryStore((state) => state.categories);
  const getCategory = useCategoryStore((state) => state.getCategory);

  const onCategoryValueChange = (option?: DisplayedCategory) => {
    console.log(`Value changed. ${JSON.stringify(option)}`);
    if (!option?.value) {
      console.log(`category with ${option?.value} not found`);
      return;
    }
    const foundCategory = getCategory(option.value);
    setSelectedCategory(foundCategory);
  };

  const handleEnd = async (customStart?: Date) => {
    if (selectedCategory === undefined) {
      console.log('No category selected');
      return;
    }
    try {
      setIoInProgress(true);
      customStart && startTimer(customStart);

      const newTime = endTimer();
      if (!newTime) {
        console.log('No end time available');
        return;
      }

      console.log(`Ending ${selectedCategory}`);

      await createActivity({
        startTime: customStart || startTime!,
        endTime: newTime,
        category: selectedCategory,
      });
    } finally {
      setIoInProgress(false);
    }
  };

  const handleEndFromLastActivity = async () => {
    const lastActivity = getLastActivity();

    if (lastActivity && lastActivity.end) {
      console.log('Last Activity:', lastActivity);
      await handleEnd(lastActivity.end);
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
        />
        <Button
          className='w-24'
          disabled={!selectedCategory || !canStart() || ioInProgress}
          onPress={handleStart}
        >
          <Text>Start</Text>
        </Button>
      </View>
      <View className='flex w-full flex-row items-center justify-center gap-8'>
        <Button
          className='w-24'
          variant={'destructive'}
          disabled={!canEnd() || !selectedCategory || ioInProgress}
          onPress={() => handleEnd()}
        >
          <Text>End</Text>
        </Button>
        <Button
          className='w-72'
          variant={'accent'}
          disabled={
            !canStart() ||
            !selectedCategory ||
            !getLastActivity() ||
            ioInProgress
          }
          onPress={handleEndFromLastActivity}
        >
          <Text>End from last activity</Text>
        </Button>
      </View>
    </View>
  );
}
