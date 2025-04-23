import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { Activity } from '@/lib/core/activity';
import { ActivityManager } from '@/lib/core/activity-manager';
import { useActivityStore } from '@/store/useActivityStore';
import { useMemo } from 'react';
import { View } from 'react-native';

export default function Activities() {
  const activitiesFromStore = useActivityStore((state) => state.activities);
  const isLoadingActivities = useActivityStore((state) => state.isLoading);
  const resetAll = useActivityStore((state) => state.resetAll);

  const activities = useMemo(() => {
    return ActivityManager.groupByLogicalDate(activitiesFromStore);
  }, [activitiesFromStore]);

  if (isLoadingActivities) {
    return (
      <View className='flex flex-1 flex-col items-center justify-center'>
        <Text>Loading activities...</Text>
      </View>
    );
  }

  if (!activities || Object.keys(activities).length === 0) {
    return (
      <View className='flex flex-1 flex-col items-center justify-center'>
        <Text>No activities recorded yet.</Text>
      </View>
    );
  }

  return (
    <View className='flex flex-1 flex-col items-center px-2 gap-8'>
      {Object.keys(activities).map((logicalDate) => (
        <View key={logicalDate} className='w-full'>
          <Text className='font-bold text-lg'>{logicalDate}</Text>
          {activities[logicalDate].map((a) => (
            <ActivityCard key={a.toString()} activity={a} />
          ))}
        </View>
      ))}
      {/* Reset button for testing */}
      <View className='flex justify-center items-center flex-row'>
        <Button variant={'destructive'} onPress={resetAll}>
          <Text>RESET ALL</Text>
        </Button>
      </View>
    </View>
  );
}

function ActivityCard({ activity }: { activity: Activity }) {
  return (
    <View className='flex flex-row gap-8 w-full px-8'>
      <View className='flex flex-row gap-2'>
        <Text className='text-slate-400'>{formatTimeOnly(activity.start)}</Text>
        <Text className='text-slate-200'>-</Text>
        <Text className='text-slate-200'>{formatTimeOnly(activity.end)}</Text>
      </View>
      <View>
        <Text>{activity.category.toString()}</Text>
      </View>
    </View>
  );
}

function formatTimeOnly(date: Date): string {
  return `${date.getHours().toString().padStart(2, '0')}:${date
    .getMinutes()
    .toString()
    .padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`;
}
