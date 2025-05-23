import clsx from 'clsx';
import { useEffect, useState } from 'react';
import { Pressable, View } from 'react-native';
import DatePicker from 'react-native-date-picker';
import { Activity } from '@/lib/core/activity';
import { formatDurationWithUnits, titleCase } from '@/lib/utils/index';
import { DialogComponent } from '@/components/ui/DialogComponent';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Text } from '@/components/ui/text';
import { useActivityStore } from '@/store/useActivityStore';

export function ActivityRowInActivityPage({
  activity,
}: {
  activity: Activity;
}) {
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
  let hours, minutes, seconds;
  let modalTitle;

  if (timeType === 'start') {
    [hours, minutes, seconds] = activity.start.toLocaleTimeString().split(':');
    modalTitle = 'Edit Start Time';
  } else {
    [hours, minutes, seconds] = activity.end
      ? activity.end.toLocaleTimeString().split(':')
      : [undefined, undefined, undefined];
    modalTitle = 'Edit End Time';
  }

  const [date, setDate] = useState<Date>(new Date());
  const [open, setOpen] = useState(false);
  const [ioInProgress, setIoInProgress] = useState(false);

  const tryUpdateStart = useActivityStore((state) => state.tryUpdateStart);
  const tryUpdateEnd = useActivityStore((state) => state.tryUpdateEnd);
  const handleConfirm = createConfirmHandler({
    activity,
    tryUpdateStart,
    tryUpdateEnd,
    setDate,
    setOpen,
    source: timeType,
  });

  return (
    <View className='flex flex-col gap-4'>
      <Dialog
        onOpenChange={(opened) => {
          if (opened) {
            if (timeType === 'start') {
              setDate(activity.start);
              setOpen(true);
            } else {
              activity.end && setDate(activity.end);
              setOpen(true);
            }
          } else {
            setOpen(false);
          }
        }}
        open={open}
      >
        <DialogTrigger asChild>
          <Pressable disabled={ioInProgress}>
            <Text
              className={clsx(
                'w-16 rounded-md px-2 py-1 text-center',
                timeType === 'start' ? 'bg-primary/40' : 'bg-destructive/40'
              )}
            >
              {hours}:{minutes}
            </Text>
          </Pressable>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{modalTitle}</DialogTitle>
          </DialogHeader>
          <DatePicker date={date} mode='datetime' onDateChange={setDate} />
          <DialogFooter>
            <DialogClose asChild>
              <View className='flex flex-row justify-end'>
                <Button
                  variant={'outline'}
                  onPress={async () => {
                    try {
                      setIoInProgress(true);
                      await handleConfirm(date);
                    } catch (error) {
                      console.error(error);
                    } finally {
                      setIoInProgress(false);
                    }
                  }}
                  disabled={ioInProgress}
                >
                  <Text>Confirm</Text>
                </Button>
              </View>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </View>
  );
}

function createConfirmHandler({
  activity,
  tryUpdateStart,
  tryUpdateEnd,
  setDate,
  setOpen,
  source,
}: {
  activity: Activity;
  tryUpdateStart: (
    activity: Activity,
    selectedDate: Date
  ) => Promise<Date | undefined>;
  tryUpdateEnd: (
    activity: Activity,
    selectedDate: Date
  ) => Promise<Date | undefined>;
  setDate: (date: Date) => void;
  setOpen: (open: boolean) => void;
  source: 'start' | 'end';
}) {
  return async (selectedDate: Date) => {
    try {
      if (source === 'start') {
        const updatedStart = await tryUpdateStart(activity, selectedDate);
        if (updatedStart) {
          setDate(updatedStart);
        } else {
          setDate(activity.start);
        }
        return;
      }
      if (source === 'end') {
        if (!activity.end) {
          return;
        }
        const updatedEnd = await tryUpdateEnd(activity, selectedDate);
        if (updatedEnd) {
          setDate(updatedEnd);
        } else {
          setDate(activity.end);
        }
        return;
      }

      throw new Error('Invalid source type');
    } catch (error) {
      console.error('Error updating activity:', error);
    } finally {
      setOpen(false);
    }
  };
}
