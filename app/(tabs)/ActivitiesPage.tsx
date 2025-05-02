import { ScrollView, View } from 'react-native';
import { Activity } from '@/lib/core/activity';
import { formatTimeOnly } from '@/lib/utils/index';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { useActivityStore } from '@/store/useActivityStore';

export default function ActivitiesPage() {
  const activities = useActivityStore((state) => state.activitiesByDate);
  const isLoadingActivities = useActivityStore((state) => state.isLoading);
  const resetAll = useActivityStore((state) => state.resetAll);

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
    <ScrollView className='flex flex-1 flex-col gap-8 px-2'>
      {Object.keys(activities).map((logicalDate) => (
        <View key={logicalDate} className='w-full'>
          <Text className='text-lg font-bold'>{logicalDate}</Text>
          {activities[logicalDate].map((a) => (
            <ActivityCard key={a.id} activity={a} />
          ))}
        </View>
      ))}
      {/* Reset button for testing */}
      <View className='flex flex-row items-center justify-center'>
        <Button variant={'destructive'} onPress={resetAll}>
          <Text>RESET ALL</Text>
        </Button>
      </View>
    </ScrollView>
  );
}

function ActivityCard({ activity }: { activity: Activity }) {
  return (
    <View className='flex w-full flex-row gap-8 px-8'>
      <View className='flex flex-row gap-2'>
        <Text className='text-slate-400'>{formatTimeOnly(activity.start)}</Text>
        <Text className='text-slate-200'>-</Text>
        <Text className='text-slate-200'>
          {activity.end ? formatTimeOnly(activity.end) : '...'}
        </Text>
      </View>
      <View>
        <Text>{activity.category.toString()}</Text>
      </View>
    </View>
  );
}
