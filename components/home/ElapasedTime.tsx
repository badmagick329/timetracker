import { DisplayedCategory } from '@/lib/types';
import { Text } from '../ui/text';
import { useEffect, useState } from 'react';
import { View } from 'react-native';
import { Button } from '../ui/button';

export default function ElapsedTime({
  category,
  activityInProgress,
}: {
  category: DisplayedCategory | undefined;
  activityInProgress: boolean;
}) {
  const [startTime, setStartTime] = useState<Date | undefined>(undefined);
  const [endTime, setEndTime] = useState<Date | undefined>(undefined);
  const [duration, setDuration] = useState(0); // in milliseconds

  useEffect(() => {
    if (activityInProgress) {
      console.log('Setting start time');
      setStartTime(new Date());
      setEndTime(undefined);
    } else {
      if (!startTime) {
        console.log('Start time not set');
        return;
      }
      const now = new Date();
      setEndTime(now);
      setDuration(now.getTime() - startTime.getTime());
    }
  }, [activityInProgress]);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (activityInProgress && startTime && !endTime) {
      interval = setInterval(() => {
        console.log('Updating duration');
        setDuration(new Date().getTime() - startTime.getTime());
      }, 100);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [activityInProgress, startTime, endTime]);

  // Format duration to be more readable (HH:MM:SS.MS)
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
            setStartTime(undefined);
            setEndTime(undefined);
          }}
        >
          <Text>Clear</Text>
        </Button>
      </View>
    </View>
  );
}
