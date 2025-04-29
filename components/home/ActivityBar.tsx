import clsx from 'clsx';
import { View } from 'react-native';
import { Text } from '@/components/ui/text';

export function ActivityBar({
  startTime,
  endTime,
  endTimeEmptyContent,
  content,
}: {
  startTime: Date;
  endTime?: Date;
  endTimeEmptyContent?: React.ReactNode;
  content?: React.ReactNode;
}) {
  const [startHours, startMinutes, startSeconds] = startTime
    .toLocaleTimeString()
    .split(':');
  const [endHours, endMinutes, endSeconds] = endTime
    ? endTime.toLocaleTimeString().split(':')
    : [undefined, undefined, undefined];

  return (
    <View className='flex flex-row gap-2 w-full justify-between rounded-md items-center'>
      <View className='flex flex-row'>
        <View
          className={clsx(
            'flex flex-row items-end justify-center bg-primary/80 px-4 py-4 rounded-l-md w-24'
          )}
        >
          <Text>
            {startHours}:{startMinutes}
          </Text>
          <Text className='text-foreground/60 text-xs pb-[2]'>
            .{startSeconds}
          </Text>
        </View>
        {endTime ? (
          <View className='flex flex-row items-end justify-center bg-destructive/80 px-4 py-4 rounded-r-md w-24'>
            <Text>
              {endHours}:{endMinutes}
            </Text>
            <Text className='text-foreground/60 text-xs pb-[2]'>
              .{endSeconds}
            </Text>
          </View>
        ) : (
          <View className='flex flex-row justify-center items-end bg-secondary/10 px-4 py-4 rounded-r-md w-24'>
            {endTimeEmptyContent}
          </View>
        )}
      </View>
      {content}
    </View>
  );
}
