import { View } from 'react-native';
import '@/global.css';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import CategoryPicker from '@/components/home/CategoryPicker';
import { DisplayedCategory } from '@/lib/types';
import { useState } from 'react';
import ElapsedTime from '@/components/home/ElapasedTime';
import { useStore } from '@/store/useStore';
import { useTimerStore } from '@/store/useTimerStore';

const testCategories: DisplayedCategory[] = [
  {
    label: 'Study',
    value: 'study',
  },
  {
    label: 'Workout',
    value: 'workout',
  },
  {
    label: 'Gaming',
    value: 'gaming',
  },
];

export default function Index() {
  const [selectedCategory, setSelectedCategory] = useState<
    DisplayedCategory | undefined
  >(undefined);
  const { createActivity } = useStore();
  const startTime = useTimerStore((state) => state.startTime);
  const endTime = useTimerStore((state) => state.endTime);
  const startTimer = useTimerStore((state) => state.startTimer);
  const endTimer = useTimerStore((state) => state.endTimer);

  const handleStart = () => {
    const newTime = startTimer();
    if (newTime) {
      console.log(`Starting ${selectedCategory?.value}`);
    }
  };

  const handleEnd = async () => {
    if (selectedCategory === undefined) {
      return;
    }
    const newTime = endTimer();
    if (!newTime) {
      return;
    }

    console.log(`Ending ${selectedCategory?.value}`);

    await createActivity({
      startTime: startTime!,
      endTime: newTime,
      category: selectedCategory.value,
    });
  };

  const canStart = startTime === undefined && endTime === undefined;
  const canEnd = startTime !== undefined && endTime === undefined;

  return (
    <View className='flex pt-8 items-center flex-1 bg-background flex-col gap-24'>
      <View className='flex justify-center items-center flex-row w-full'>
        <ElapsedTime category={selectedCategory} />
      </View>
      <View className='flex justify-center items-center gap-8 flex-row w-full'>
        <Button
          className='w-32'
          size={'lg'}
          variant={'accent'}
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
          onPress={handleEnd}
        >
          <Text>End</Text>
        </Button>
      </View>
      <View className='flex justify-center items-center flex-row w-full'>
        <CategoryPicker
          categories={testCategories}
          onValueChange={setSelectedCategory}
        />
      </View>
    </View>
  );
}
