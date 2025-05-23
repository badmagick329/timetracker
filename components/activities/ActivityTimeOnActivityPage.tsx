import clsx from 'clsx';
import { useEffect, useState } from 'react';
import { Pressable, View } from 'react-native';
import DatePicker from 'react-native-date-picker';
import { Activity } from '@/lib/core/activity';
import { formatTimeOnly } from '@/lib/utils/index';
import { Button } from '@/components/ui/button';
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

export function ActivityTimeOnActivityPage({
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

  if (!activity.end && timeType === 'end') {
    return (
      <View className='flex flex-col gap-4'>
        <Text
          className={clsx(
            'w-16 rounded-md bg-destructive/40 px-2 py-1 text-center'
          )}
        >
          ...
        </Text>
      </View>
    );
  }

  return (
    <View className='flex flex-col gap-4'>
      <Dialog
        onOpenChange={(opened) => {
          if (opened) {
            if (timeType === 'start') {
              setDate(activity.start);
              setOpen(true);
            } else {
              if (!activity.end) {
                return;
              }
              setDate(activity.end);
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

export function ActivityTimeOnActivityPageWithAltPicker({
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

  useEffect(() => {
    if (timeType === 'start') {
      setDate(activity.start);
    } else {
      activity.end && setDate(activity.end);
    }
  }, [activity.start, activity.end]);

  if (!activity.end && timeType === 'end') {
    return (
      <View className='flex flex-col gap-4'>
        <Text
          className={clsx(
            'w-16 rounded-md bg-destructive/40 px-2 py-1 text-center'
          )}
        >
          ...
        </Text>
      </View>
    );
  }

  return (
    <View className='flex flex-col gap-4'>
      <Dialog
        onOpenChange={(opened) => {
          if (opened) {
            if (timeType === 'start') {
              setOpen(true);
            } else {
              if (!activity.end) {
                return;
              }
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
          <DialogDescription>
            <View className='flex w-full flex-col gap-2'>
              <View className='flex flex-row justify-end gap-4'>
                <Button
                  onPress={() => {
                    console.log('updating date');
                    setDate((prev) => {
                      const newDate = new Date(prev);
                      newDate.setTime(newDate.getTime() - 15 * 60 * 1000);
                      return newDate;
                    });
                  }}
                >
                  <Text>15-</Text>
                </Button>
                <Button
                  variant={'outline'}
                  onPress={() => {
                    console.log('updating date');
                    setDate((prev) => {
                      const newDate = new Date(prev);
                      newDate.setTime(newDate.getTime() - 5 * 60 * 1000);
                      return newDate;
                    });
                  }}
                >
                  <Text>5-</Text>
                </Button>
                <Button
                  variant={'outline'}
                  onPress={() => {
                    setDate((prev) => {
                      const newDate = new Date(prev);
                      newDate.setTime(newDate.getTime() + 5 * 60 * 1000);
                      return newDate;
                    });
                  }}
                >
                  <Text>5+</Text>
                </Button>
                <Button
                  onPress={() => {
                    setDate((prev) => {
                      const newDate = new Date(prev);
                      newDate.setTime(newDate.getTime() + 15 * 60 * 1000);
                      return newDate;
                    });
                  }}
                >
                  <Text>15+</Text>
                </Button>
              </View>
              <Text>{formatTimeOnly(date)}</Text>
            </View>
          </DialogDescription>
          <DialogFooter>
            <DialogClose asChild>
              <View className='flex w-full flex-row justify-end'>
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
