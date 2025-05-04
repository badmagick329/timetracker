import Animated from 'react-native-reanimated';
import { cardSpringify } from '@/lib/utils/index';
import { CurrentActivity } from '@/components/home/CurrentActivity';
import { LastActivity } from '@/components/home/LastActivity';

export function RecentActivityInfo() {
  return (
    <Animated.View
      className={'justify-between gap-12 px-8 py-2'}
      layout={cardSpringify()}
      collapsable={false}
    >
      <CurrentActivity />
      <LastActivity />
    </Animated.View>
  );
}
