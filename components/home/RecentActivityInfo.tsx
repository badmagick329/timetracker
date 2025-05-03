import Animated, { LinearTransition } from 'react-native-reanimated';
import { CurrentActivity } from '@/components/home/CurrentActivity';
import { LastActivity } from '@/components/home/LastActivity';

export function RecentActivityInfo() {
  return (
    <Animated.View
      className={'gap-8 px-8'}
      layout={LinearTransition.springify()}
      collapsable={false}
    >
      <CurrentActivity />
      <LastActivity />
    </Animated.View>
  );
}
