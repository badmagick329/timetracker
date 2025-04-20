import { View } from 'react-native';
import '../../global.css';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import CategoryPicker from '@/components/home/CategoryPicker';
import { DisplayedCategory } from '@/lib/types';
import { useState } from 'react';
import ElapsedTime from '@/components/home/ElapasedTime';
import { useStore } from '@/store/useStore';

const testCategories = [
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
  const [activityInProgress, setActivityInProgress] = useState(false);
  const { createActivity, getActivities, timerState } = useStore();
  const { startTime, setStartTime, setEndTime } = timerState;

  const handleStart = () => {
    console.log(`Starting ${selectedCategory?.value}`);
    setActivityInProgress(true);
    setStartTime(new Date());
  };

  const handleEnd = async () => {
    console.log(`Ending ${selectedCategory?.value}`);
    const newEndTime = new Date();
    setEndTime(newEndTime);
    setActivityInProgress(false);
    console.log(`${startTime} ${newEndTime} ${selectedCategory?.value}`);
    if (!(startTime && newEndTime && selectedCategory)) {
      return;
    }
    await createActivity({
      startTime: startTime,
      endTime: newEndTime,
      category: selectedCategory.value,
    });

    console.log(`Number of activities: ${(await getActivities())?.length}`);
  };

  return (
    <View className='flex pt-8 items-center flex-1 bg-background flex-col gap-24'>
      <View className='flex justify-center items-center flex-row w-full'>
        <ElapsedTime
          category={selectedCategory}
          activityInProgress={activityInProgress}
        />
      </View>
      <View className='flex justify-center items-center gap-8 flex-row w-full'>
        <Button
          className='w-32'
          size={'lg'}
          variant={'accent'}
          disabled={!selectedCategory}
          onPress={handleStart}
        >
          <Text>Start</Text>
        </Button>
        <Button
          className='w-32'
          size={'lg'}
          variant={'destructive'}
          disabled={!selectedCategory || !activityInProgress}
          onPress={handleEnd}
        >
          <Text>End</Text>
        </Button>
      </View>
      <View className='flex justify-center items-center flex-row w-full'>
        <CategoryPicker
          categories={testCategories}
          onValueChange={setSelectedCategory}
          activityInProgress={activityInProgress}
        />
      </View>
    </View>
  );
}
