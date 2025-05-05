import { useEffect, useState } from 'react';
import { View } from 'react-native';
import { Activity } from '@/lib/core/activity';
import { formatDurationWithUnits, titleCase } from '@/lib/utils/index';
import { Text } from '@/components/ui/text';

export function ActivityDisplay({ activity }: { activity: Activity }) {
  const [startHours, startMinutes, startSeconds] = activity.start
    .toLocaleTimeString()
    .split(':');
  const [endHours, endMinutes, endSeconds] = activity.end
    ? activity.end.toLocaleTimeString().split(':')
    : [undefined, undefined, undefined];

  const [duration, setDuration] = useState(0);
  useEffect(() => {
    if (activity.end) {
      setDuration(activity.duration);
      return;
    }

    const interval = setInterval(() => {
      setDuration(activity.duration);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <View className='flex w-full flex-col gap-2 rounded-md bg-foreground/5 px-8 py-2'>
      <View className='flex flex-row items-center justify-between'>
        <Text className='text-lg font-semibold'>
          {titleCase(activity.category.toString())}
        </Text>
        <Text>{formatDurationWithUnits(duration)}</Text>
      </View>
      <View className='flex w-full flex-row justify-between gap-8'>
        <View className='flex flex-row gap-2'>
          <View className='flex flex-row'>
            <Text className='text-foreground/60'>
              {startHours}:{startMinutes}
            </Text>
            <Text className='self-end pb-[2] text-xs text-foreground/60'>
              .{startSeconds}
            </Text>
          </View>
          <Text>-</Text>
          {activity.end && (
            <View className='flex flex-row'>
              <Text className='text-foreground/60'>
                {endHours}:{endMinutes}
              </Text>
              <Text className='self-end pb-[2] text-xs text-foreground/60'>
                .{endSeconds}
              </Text>
            </View>
          )}
        </View>
      </View>
    </View>
  );
}
