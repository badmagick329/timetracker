import { ScrollView, View } from 'react-native';
import { Activity } from '@/lib/core/activity';
import { ActivityDisplay } from '@/components/activities/ActivityDisplay';
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
  const entries = Object.entries(activities);
  entries.sort(([aKey], [bKey]) => bKey.localeCompare(aKey));
  const sortedActivities = Object.fromEntries(entries);

  return (
    <ScrollView className='flex flex-col gap-8 px-2'>
      {Object.keys(sortedActivities).map((logicalDate) => (
        <View key={logicalDate} className='w-full gap-4 pt-4'>
          <Text className='rounded-md bg-foreground/20 py-2 text-center text-xl font-bold'>
            {logicalDate}
          </Text>
          <ActivitiesDisplayAsDesc activities={activities[logicalDate]} />
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

function ActivitiesDisplayAsDesc({ activities }: { activities: Activity[] }) {
  const sortedActivities = activities.sort((a, b) => {
    if (a.start > b.start) return -1;
    if (a.start < b.start) return 1;
    return 0;
  });

  return (
    <>
      {sortedActivities.map((a) => (
        <ActivityDisplay key={a.id} activity={a} />
      ))}
    </>
  );
}
