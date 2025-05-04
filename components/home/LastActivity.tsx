import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { animationDuration } from '@/lib/consts';
import {
  cardSpringify,
  formatDurationWithUnits,
  titleCase,
} from '@/lib/utils/index';
import { ActivityBar } from '@/components/home/ActivityBar';
import {
  ActivityCardContent,
  ActivityCardHeader,
  ActivityCardWrapper,
} from '@/components/home/ActivityCard';
import { Text } from '@/components/ui/text';
import { useActivityStore } from '@/store/useActivityStore';

export function LastActivity() {
  const activity = useActivityStore((state) => state.lastCompletedActivity);

  if (!activity) {
    return null;
  }

  if (activity.duration === undefined) {
    console.error('Activity duration is undefined');
    return null;
  }

  return (
    <Animated.View
      key='last'
      entering={FadeIn.duration(animationDuration.xs)}
      exiting={FadeOut.duration(animationDuration.xs)}
      layout={cardSpringify()}
      collapsable={false}
    >
      <ActivityCardWrapper>
        <ActivityCardHeader>
          <Text className='text-xl font-bold'>
            {titleCase(activity.category.name)}
          </Text>
          <Text className='text-sm font-bold text-muted-foreground'>
            {formatDurationWithUnits(activity.duration)}
          </Text>
        </ActivityCardHeader>
        <ActivityCardContent>
          <ActivityBar startTime={activity.start} endTime={activity.end} />
        </ActivityCardContent>
      </ActivityCardWrapper>
    </Animated.View>
  );
}
