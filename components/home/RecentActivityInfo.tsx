import { View } from 'react-native';
import { CurrentActivity } from '@/components/home/CurrentActivity';
import { LastActivity } from '@/components/home/LastActivity';

export function RecentActivityInfo() {
  return (
    <View className='flex flex-col items-center gap-8 px-6'>
      <CurrentActivity />
      <LastActivity />
    </View>
  );
}
