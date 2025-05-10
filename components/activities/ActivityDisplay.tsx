import clsx from 'clsx';
import { useEffect, useState } from 'react';
import { View } from 'react-native';
import DatePicker from 'react-native-date-picker';
import { Pressable } from 'react-native-gesture-handler';
import { Activity } from '@/lib/core/activity';
import { formatDurationWithUnits, titleCase } from '@/lib/utils/index';
import { DialogComponent } from '@/components/ui/DialogComponent';
import { Text } from '@/components/ui/text';
import { useActivityStore } from '@/store/useActivityStore';

export function ActivityDisplay({ activity }: { activity: Activity }) {
  const [duration, setDuration] = useState(0);
  const removeActivity = useActivityStore((state) => state.removeActivity);
  const [ioInProgress, setIoInProgress] = useState(false);

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
          <ActivityTime activity={activity} timeType='start' />
          <Text>-</Text>
          <ActivityTime activity={activity} timeType='end' />
        </View>
        <DialogComponent
          buttonText='Delete'
          description='Are you sure you want to delete this activity? This action cannot be undone.'
          dialogTitle='Confirm Delete'
          confirmationText='Yes'
          isEnabled={!ioInProgress}
          buttonVariant={{ variant: 'outline' }}
          onConfirm={async () => {
            try {
              setIoInProgress(true);
              await removeActivity(activity);
            } finally {
              setIoInProgress(false);
            }
          }}
        />
      </View>
    </View>
  );
}

function ActivityTime({
  activity,
  timeType,
}: {
  activity: Activity;
  timeType: 'start' | 'end';
}) {
  const defaultDate = new Date();
  let hours, minutes, seconds;
  let modalTitle;

  if (timeType === 'start') {
    defaultDate.setTime(activity.start.getTime());
    [hours, minutes, seconds] = activity.start.toLocaleTimeString().split(':');
    modalTitle = 'Edit Start Time';
  } else {
    activity.end && defaultDate.setTime(activity.end.getTime());
    [hours, minutes, seconds] = activity.end
      ? activity.end.toLocaleTimeString().split(':')
      : [undefined, undefined, undefined];
    modalTitle = 'Edit End Time';
  }

  const [date, setDate] = useState<Date>(defaultDate);
  const [open, setOpen] = useState(false);

  const updateActivity = useActivityStore((state) => state.updateActivity);
  const handleConfirm = createConfirmHandler({
    activity,
    updateActivity,
    setDate,
    setOpen,
    source: timeType,
  });

  return (
    <View className='flex flex-col gap-4'>
      <Pressable
        onPress={() => {
          setOpen(true);
        }}
      >
        <Text
          className={clsx(
            'w-16 rounded-md px-2 py-1 text-center',
            timeType === 'start' ? 'bg-primary/40' : 'bg-destructive/40'
          )}
        >
          {hours}:{minutes}
        </Text>
      </Pressable>
      <DatePicker
        modal
        title={modalTitle}
        date={date}
        open={open}
        mode='time'
        onConfirm={handleConfirm}
        onCancel={() => {
          setOpen(false);
        }}
      />
    </View>
  );
}

function createConfirmHandler({
  activity,
  updateActivity,
  setDate,
  setOpen,
  source,
}: {
  activity: Activity;
  updateActivity: (activity: Activity) => Promise<boolean | undefined>;
  setDate: (date: Date) => void;
  setOpen: (open: boolean) => void;
  source: 'start' | 'end';
}) {
  return async (selectedDate: Date) => {
    try {
      if (source === 'start') {
        let minStart = activity?.previous?.end;
        let newStart = new Date(activity.start);
        newStart.setTime(selectedDate.getTime());

        if (minStart && newStart < minStart) {
          newStart = minStart;
          setDate(newStart);
        } else {
          setDate(selectedDate);
        }

        if (activity.start.getTime() === newStart.getTime()) {
          return;
        }

        const success = await updateActivity(
          activity.cloneWith({ start: newStart })
        );
        if (!success) {
          setDate(activity.start);
        }
      } else {
        if (!activity.end) {
          console.log(`No end found for ${activity} returning`);
          return;
        }

        setDate(selectedDate);
        let maxEnd = activity?.next?.start;
        let newEnd = new Date(activity.end);
        newEnd.setTime(selectedDate.getTime());
        if (maxEnd && newEnd > maxEnd) {
          newEnd = maxEnd;
        }

        if (activity.end === newEnd) {
          console.log(`No changes for ${activity} returning`);
          return;
        }

        const success = await updateActivity(
          activity.cloneWith({ end: newEnd })
        );
        if (success) {
          console.log(`Updated ${activity} to ${newEnd}`);
        } else {
          console.log(`Failed to update ${activity} to ${newEnd}`);
        }

        if (!success && activity.end) {
          setDate(activity.end);
        }
      }
    } finally {
      setOpen(false);
    }
  };
}
