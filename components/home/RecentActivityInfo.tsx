import { useEffect, useState } from 'react';
import { View } from 'react-native';
import { Category } from '@/lib/core/category';
import { CurrentActivity } from '@/components/home/CurrentActivity';
import { LastActivity } from '@/components/home/LastActivity';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { useActivityStore } from '@/store/useActivityStore';
import { useTimerStore } from '@/store/useTimerStore';

export function RecentActivityInfo({
  category,
}: {
  category: Category | undefined;
}) {
  const [duration, setDuration] = useState(0); // in milliseconds
  const startTime = useTimerStore((state) => state.startTime);
  const endTime = useTimerStore((state) => state.endTime);
  const getDuration = useTimerStore((state) => state.getDuration);
  const resetTimer = useTimerStore((state) => state.resetTimer);

  const getLastActivity = useActivityStore(
    (state) => state.getLastCompletedActivity
  );
  const lastActivity = getLastActivity();

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (startTime && !endTime) {
      interval = setInterval(() => {
        setDuration(getDuration());
      }, 100);
    }

    if (startTime && endTime) {
      setDuration(getDuration());
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [startTime, endTime]);

  return (
    <View className='flex flex-col items-center gap-8 px-6'>
      <Button
        className='w-32'
        disabled={!(startTime && endTime && duration > 0)}
        onPress={() => {
          setDuration(0);
          resetTimer();
        }}
      >
        <Text>Clear</Text>
      </Button>
      <CurrentActivity
        category={category}
        startTime={startTime}
        endTime={endTime}
        duration={duration}
      />
      <LastActivity activity={lastActivity} />
    </View>
  );
}
