import { useEffect, useState } from 'react';
import { View } from 'react-native';
import { Activity } from '@/lib/core/activity';
import { formatDurationWithUnits, titleCase } from '@/lib/utils/index';
import {
  ActivityTimeOnActivityPage,
  ActivityTimeOnActivityPageWithAltPicker,
} from '@/components/activities/ActivityTimeOnActivityPage';
import { DialogComponent } from '@/components/ui/DialogComponent';
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
          <ActivityTimeOnActivityPageWithAltPicker
            activity={activity}
            timeType='start'
          />
          <Text>-</Text>
          <ActivityTimeOnActivityPageWithAltPicker
            activity={activity}
            timeType='end'
          />
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
