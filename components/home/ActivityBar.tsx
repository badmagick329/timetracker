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
    <View className='flex w-full flex-row items-center justify-between gap-2 rounded-3xl'>
      <View className='flex flex-row'>
        <View
          className={clsx(
            'flex w-24 flex-row items-end justify-center rounded-l-3xl border-2 border-r-0 border-primary/80 px-4 py-4'
          )}
        >
          <Text>
            {startHours}:{startMinutes}
          </Text>
          <Text className='pb-[2] text-xs text-foreground/60'>
            .{startSeconds}
          </Text>
        </View>
        {endTime ? (
          <View
            className={clsx(
              'flex w-24 flex-row items-end justify-center rounded-r-3xl border-2 border-destructive/80 px-4 py-4'
            )}
          >
            <Text>
              {endHours}:{endMinutes}
            </Text>
            <Text className='pb-[2] text-xs text-foreground/60'>
              .{endSeconds}
            </Text>
          </View>
        ) : (
          <View
            className={clsx(
              'flex w-24 flex-row items-end justify-center rounded-r-3xl border-2 border-secondary/20 px-4 py-4'
            )}
          >
            {endTimeEmptyContent}
          </View>
        )}
      </View>
      {content}
    </View>
  );
}
