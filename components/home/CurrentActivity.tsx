import { useEffect, useState } from 'react';
import { View } from 'react-native';
import Animated, { FadeInUp, FadeOutUp } from 'react-native-reanimated';
import { animationDuration } from '@/lib/consts';
import {
  cardSpringify,
  formattedDuration2,
  titleCase,
} from '@/lib/utils/index';
import { ActivityBar } from '@/components/home/ActivityBar';
import { ActivityCard } from '@/components/home/ActivityCard';
import { Text } from '@/components/ui/text';
import { useActivityStore } from '@/store/useActivityStore';

export function CurrentActivity() {
  const [duration, setDuration] = useState(0); // in milliseconds
  const activityInProgress = useActivityStore(
    (state) => state.activityInProgress
  );

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (activityInProgress) {
      interval = setInterval(() => {
        setDuration(activityInProgress.duration);
      }, 100);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [activityInProgress]);

  if (!activityInProgress) {
    const showPlaceholder = false;
    return showPlaceholder ? (
      <ActivityCard
        header={
          <>
            <Text className='text-xl font-bold'>{'Placeholder'}</Text>
            <Text className='text-sm text-muted-foreground'>
              {formattedDuration2(50000)}
            </Text>
          </>
        }
        content={
          <ActivityBar
            endTimeEmptyContent={
              <View className='h-5 w-5 animate-bounce rounded-full border-2 border-green-700/80 bg-green-700/60'></View>
            }
            startTime={new Date()}
          />
        }
      />
    ) : null;
  }

  return (
    <Animated.View
      key={activityInProgress.id}
      entering={FadeInUp.duration(animationDuration.xs)}
      exiting={FadeOutUp.duration(animationDuration.xs)}
      layout={cardSpringify()}
      collapsable={false}
    >
      <ActivityCard
        header={
          <>
            <Text className='text-xl font-bold'>
              {titleCase(activityInProgress.category.name)}
            </Text>
            <Text className='text-sm text-muted-foreground'>
              {formattedDuration2(duration)}
            </Text>
          </>
        }
        content={
          <ActivityBar
            endTimeEmptyContent={
              <View className='h-5 w-5 animate-bounce rounded-full border-2 border-green-700/80 bg-green-700/60'></View>
            }
            startTime={activityInProgress.start}
          />
        }
      />
    </Animated.View>
  );
}
