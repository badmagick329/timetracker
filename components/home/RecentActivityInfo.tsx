import clsx from 'clsx';
import { useEffect, useState } from 'react';
import { View } from 'react-native';
import { Activity } from '@/lib/core/activity';
import { Category } from '@/lib/core/category';
import { formattedDuration2, titleCase } from '@/lib/utils/index';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { useActivityStore } from '@/store/useActivityStore';
import { useTimerStore } from '@/store/useTimerStore';

export default function RecentActivityInfo({
  category,
}: {
  category: Category | undefined;
}) {
  const [duration, setDuration] = useState(0); // in milliseconds
  const startTime = useTimerStore((state) => state.startTime);
  const endTime = useTimerStore((state) => state.endTime);
  const getDuration = useTimerStore((state) => state.getDuration);
  const resetTimer = useTimerStore((state) => state.resetTimer);

  const getLastActivity = useActivityStore((state) => state.getLastActivity);
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

function CurrentActivity({
  category,
  startTime,
  endTime,
  duration,
}: {
  category?: Category;
  startTime?: Date;
  endTime?: Date;
  duration: number;
}) {
  // if not in progress
  if (!startTime || endTime || !category) {
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
              <View className='w-5 h-5 border-destructive/40 border-2 animate-bounce rounded-full bg-destructive/20'></View>
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
          <Text className='text-xl font-bold'>{titleCase(category.name)}</Text>
          <Text className='text-sm text-muted-foreground'>
            {formattedDuration2(duration)}
          </Text>
        </>
      }
      content={
        <ActivityBar
          endTimeEmptyContent={
            <View className='w-5 h-5 border-destructive/40 border-2 animate-bounce rounded-full bg-destructive/20'></View>
          }
          startTime={startTime}
        />
      }
    />
  );
}

function LastActivity({ activity }: { activity?: Activity }) {
  if (!activity) {
    return null;
  }

  return (
    <ActivityCard
      header={
        <>
          <Text className='font-bold text-xl'>
            {titleCase(activity.category.name)}
          </Text>
          <Text className='font-bold text-sm text-muted-foreground'>
            {formattedDuration2(activity.duration)}
          </Text>
        </>
      }
      content={
        <ActivityBar startTime={activity.start} endTime={activity.end} />
      }
    />
  );
}

function ActivityBar({
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
            // endTime ? 'rounded-l-md w-24' : 'rounded-md w-48 justify-end'
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

function ActivityCard({
  header,
  content,
  cardClassName = '',
  headerClassName = '',
}: {
  header: React.ReactNode;
  content: React.ReactNode;
  cardClassName?: string;
  headerClassName?: string;
}) {
  return (
    <View
      className={clsx(
        'flex flex-col gap-8 border-white/40 border-2 rounded-lg px-4 pt-2 pb-6 w-full',
        cardClassName
      )}
    >
      <View
        className={clsx(
          'flex flex-row w-full border-b-2 border-white items-center gap-4 justify-between',
          headerClassName
        )}
      >
        {header}
      </View>
      {content}
    </View>
  );
}

function ActivityBarv0({
  startTime,
  endTime,
  content,
}: {
  startTime: Date;
  endTime?: Date;
  content: string | React.ReactNode;
}) {
  const [startHours, startMinutes, startSeconds] = startTime
    .toLocaleTimeString()
    .split(':');
  const [endHours, endMinutes, endSeconds] = endTime
    ? endTime.toLocaleTimeString().split(':')
    : [undefined, undefined, undefined];

  return (
    <View className='flex flex-row gap-2 w-full justify-between bg-foreground/20 rounded-md'>
      <View className='flex flex-row gap-2 items-center'>
        {typeof content === 'string' ? (
          <Text className='text-lg font-bold pl-4'>{content}</Text>
        ) : (
          content
        )}
      </View>
      <View className='flex flex-row'>
        <View
          className={clsx(
            'flex flex-row items-end bg-primary/80 px-4 py-4 rounded-md'
            // endTime ? 'rounded-l-md w-24' : 'rounded-md w-48 justify-end'
          )}
        >
          <Text>
            {startHours}:{startMinutes}
          </Text>
          <Text className='text-foreground/60 text-xs pb-[2]'>
            .{startSeconds}
          </Text>
        </View>
        {endTime && (
          <View className='flex flex-row items-end bg-destructive/80 px-4 py-4 rounded-r-md'>
            <Text>
              {endHours}:{endMinutes}
            </Text>
            <Text className='text-foreground/60 text-xs pb-[2]'>
              .{endSeconds}
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}
