import { View } from 'react-native';
import '@/global.css';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import CategoryPicker from '@/components/home/CategoryPicker';
import { useState } from 'react';
import ElapsedTime from '@/components/home/ElapasedTime';
import { useTimerStore } from '@/store/useTimerStore';
import { useActivityStore } from '@/store/useActivityStore';
import { useCategoryStore } from '@/store/useCategoryStore';
import { Category } from '@/lib/core/category';

export default function Index() {
  const [selectedCategory, setSelectedCategory] = useState<
    Category | undefined
  >(undefined);
  const createActivity = useActivityStore((state) => state.createActivity);
  const startTime = useTimerStore((state) => state.startTime);
  const endTime = useTimerStore((state) => state.endTime);
  const startTimer = useTimerStore((state) => state.startTimer);
  const endTimer = useTimerStore((state) => state.endTimer);
  const getLastActivity = useActivityStore((state) => state.getLastActivity);
  const categories = useCategoryStore((state) => state.categories);
  const getCategory = useCategoryStore((state) => state.getCategory);

  const handleStart = () => {
    const newTime = startTimer();
    if (newTime) {
      console.log(`Starting ${selectedCategory}`);
    }
  };

  const handleEnd = async (customStart?: Date) => {
    if (selectedCategory === undefined) {
      console.log('No category selected');
      return;
    }
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
  };

  const canStart = startTime === undefined && endTime === undefined;
  const canEnd = startTime !== undefined && endTime === undefined;
  const displayedCategories = categories.map((c) => ({
    value: c.id,
    label: c.name,
  }));

  return (
    <View className='flex pt-8 items-center flex-1 bg-background flex-col gap-24'>
      <View className='flex justify-center items-center flex-row w-full'>
        <ElapsedTime category={selectedCategory} />
      </View>
      <View className='flex justify-center items-center gap-8 flex-col w-full'>
        <View className='flex justify-center items-center gap-8 flex-row w-full'>
          <Button
            className='w-32'
            size={'lg'}
            disabled={!selectedCategory || !canStart}
            onPress={handleStart}
          >
            <Text>Start</Text>
          </Button>
          <Button
            className='w-32'
            size={'lg'}
            variant={'destructive'}
            disabled={!canEnd || !selectedCategory}
            onPress={() => handleEnd()}
          >
            <Text>End</Text>
          </Button>
        </View>
        <View className='flex justify-center items-center flex-row'>
          <Button
            className='w-72'
            size='lg'
            variant={'accent'}
            disabled={!canStart || !selectedCategory || !getLastActivity()}
            onPress={() => {
              const lastActivity = getLastActivity();

              if (lastActivity && lastActivity.end) {
                console.log('Last Activity:', lastActivity);
                handleEnd(lastActivity.end);
              } else {
                console.log(
                  'No last activity found or start time is undefined'
                );
                handleEnd();
              }
            }}
          >
            <Text>End from last activity</Text>
          </Button>
        </View>
      </View>
      <View className='flex justify-center items-center flex-row w-full'>
        <CategoryPicker
          displayedCategories={displayedCategories}
          onValueChange={(option) => {
            console.log(`Value changed. ${JSON.stringify(option)}`);
            if (!option?.value) {
              console.log(`category with ${option?.value} not found`);
              return;
            }
            const foundCategory = getCategory(option.value);
            setSelectedCategory(foundCategory);
          }}
        />
      </View>
    </View>
  );
}
