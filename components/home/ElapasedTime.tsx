import { DisplayedCategory } from '@/lib/types';
import { Text } from '@/components/ui/text';
import { useEffect, useState } from 'react';
import { View } from 'react-native';
import { Button } from '@/components/ui/button';
import { useTimerStore } from '@/store/useTimerStore';

export default function ElapsedTime({
  category,
}: {
  category: DisplayedCategory | undefined;
}) {
  const [duration, setDuration] = useState(0); // in milliseconds
  const startTime = useTimerStore((state) => state.startTime);
  const endTime = useTimerStore((state) => state.endTime);
  const getDuration = useTimerStore((state) => state.getDuration);
  const resetTimer = useTimerStore((state) => state.resetTimer);

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

  const formattedDuration = () => {
    const ms = ((duration % 1000) / 10) | 0;
    const seconds = Math.floor((duration / 1000) % 60);
    const minutes = Math.floor((duration / (1000 * 60)) % 60);
    const hours = Math.floor(duration / (1000 * 60 * 60));

    const hourString = hours.toString().padStart(2, '0');
    const minutesString = minutes.toString().padStart(2, '0');
    const secondsString = seconds.toString().padStart(2, '0');
    const msString = ms.toString().padStart(2, '0');

    return `${hourString}:${minutesString}:${secondsString}.${msString}`;
  };

  return (
    <View className='flex flex-col justify-center gap-24 w-full px-2'>
      <View className='flex flex-col justify-center gap-2 px-6'>
        <Text className='text-lg font-bold'>
          {category && startTime && `${category?.label}`}
        </Text>
        <Text className='text-lg'>
          {startTime &&
            `${startTime.toLocaleDateString()} ${startTime.toLocaleTimeString()} - Started`}{' '}
        </Text>
        <Text className='text-lg'>
          {endTime &&
            `${endTime.toLocaleDateString()} ${endTime.toLocaleTimeString()} - Ended`}{' '}
        </Text>
      </View>
      <View className='flex flex-row justify-center gap-4'>
        <Text className='text-4xl font-bold'>{formattedDuration()}</Text>
        <Button
          disabled={!(startTime && endTime && duration > 0)}
          onPress={() => {
            setDuration(0);
            resetTimer();
          }}
        >
          <Text>Clear</Text>
        </Button>
      </View>
    </View>
  );
}
