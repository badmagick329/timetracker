import { useEffect, useState } from 'react';
import { View } from 'react-native';
import DatePicker from 'react-native-date-picker';
import { Pressable } from 'react-native-gesture-handler';
import { Activity } from '@/lib/core/activity';
import { formatDurationWithUnits, titleCase } from '@/lib/utils/index';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Text } from '@/components/ui/text';
import { useActivityStore } from '@/store/useActivityStore';

export function ActivityDisplay({ activity }: { activity: Activity }) {
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
      <View className='flex flex-row items-center justify-between border-b-2 border-foreground/20'>
        <Text className='text-lg'>
          {titleCase(activity.category.toString())}
        </Text>
        <Text className='text-base'>{formatDurationWithUnits(duration)}</Text>
      </View>
      <View className='flex w-full flex-row justify-between gap-8'>
        <View className='flex flex-row items-center gap-2'>
          <StartDisplay activity={activity} />
          <Text>-</Text>
          <EndDisplay activity={activity} />
        </View>
      </View>
    </View>
  );
}

function StartDisplay({ activity }: { activity: Activity }) {
  const dateWithTime = new Date();
  dateWithTime.setTime(activity.start.getTime());

  const [date, setDate] = useState<Date>(dateWithTime);
  const [startHours, startMinutes, startSeconds] = activity.start
    .toLocaleTimeString()
    .split(':');
  const updateActivity = useActivityStore((state) => state.updateActivity);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Pressable>
          <Text className='w-16 rounded-md bg-primary/40 px-2 py-1 text-center'>
            {startHours}:{startMinutes}
          </Text>
        </Pressable>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>Edit Start</DialogTitle>
          <DialogDescription>
            Pick a start time for this activity
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <DatePicker
              date={date}
              mode='time'
              onDateChange={async (date) => {
                console.log(`Setting date to ${date}`);
                setDate(date);
                // TODO: Refactor
                let minStart = activity?.previous?.end;
                let newStart = new Date(activity.start);
                newStart.setTime(date.getTime());
                if (minStart && newStart < minStart) {
                  newStart = minStart;
                }
                if (activity.start === newStart) return;

                await updateActivity(activity.cloneWith({ start: newStart }));
              }}
            />
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function EndDisplay({ activity }: { activity: Activity }) {
  const dateWithTime = new Date();
  activity.end && dateWithTime.setTime(activity.end.getTime());

  const [date, setDate] = useState<Date>(dateWithTime);
  const [endHours, endMinutes, endSeconds] = activity.end
    ? activity.end.toLocaleTimeString().split(':')
    : [undefined, undefined, undefined];
  const updateActivity = useActivityStore((state) => state.updateActivity);

  if (!activity.end) {
    return (
      <View className='flex flex-row justify-center px-6'>
        <View className='h-3 w-3 animate-bounce rounded-full border-2 border-destructive/60 bg-destructive/20'></View>
      </View>
    );
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Pressable>
          <Text className='w-16 rounded-md bg-destructive/40 px-2 py-1 text-center'>
            {endHours}:{endMinutes}
          </Text>
        </Pressable>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>Edit end</DialogTitle>
          <DialogDescription>
            Pick a end time for this activity
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <DatePicker
              date={date}
              mode='time'
              onDateChange={async (date) => {
                if (!activity.end) return;
                setDate(date);

                let maxEnd = activity?.next?.start;
                let newEnd = new Date(activity.end);
                newEnd.setTime(date.getTime());
                if (maxEnd && newEnd > maxEnd) {
                  newEnd = maxEnd;
                }

                if (activity.end === newEnd) return;

                await updateActivity(activity.cloneWith({ end: newEnd }));
              }}
            />
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
