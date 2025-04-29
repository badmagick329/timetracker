import { useEffect, useState } from 'react';
import { View } from 'react-native';
import { formattedDuration2, titleCase } from '@/lib/utils/index';
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
              <View className='h-5 w-5 animate-bounce rounded-full border-2 border-destructive/40 bg-destructive/20'></View>
            }
            startTime={new Date()}
          />
        }
      />
    ) : null;
  }

  return (
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
            <View className='h-5 w-5 animate-bounce rounded-full border-2 border-destructive/40 bg-destructive/20'></View>
          }
          startTime={activityInProgress.start}
        />
      }
    />
  );
}
