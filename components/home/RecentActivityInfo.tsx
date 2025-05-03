import Animated from 'react-native-reanimated';
import { cardSpringify } from '@/lib/utils/index';
import { CurrentActivity } from '@/components/home/CurrentActivity';
import { LastActivity } from '@/components/home/LastActivity';

export function RecentActivityInfo() {
  return (
    <Animated.View
      className={'gap-8 px-8'}
      layout={cardSpringify()}
      collapsable={false}
    >
      <CurrentActivity />
      <LastActivity />
    </Animated.View>
  );
}
