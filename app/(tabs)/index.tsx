import { View } from 'react-native';
import '../../global.css';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import CategoryPicker from '@/components/home/CategoryPicker';

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
  return (
    <View className='flex justify-center items-center flex-1 bg-background flex-col gap-24'>
      <View className='flex justify-center items-center gap-8 flex-row w-full'>
        <Button className='w-32' size={'lg'} variant={'accent'}>
          <Text>Start</Text>
        </Button>
        <Button className='w-32' size={'lg'} variant={'destructive'}>
          <Text>End</Text>
        </Button>
      </View>
      <View className='flex justify-center items-center gap-8 flex-row w-full'>
        <CategoryPicker categories={testCategories} />
      </View>
    </View>
  );
}
