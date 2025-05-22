import { memo, useMemo } from 'react';
import { FlatList, View } from 'react-native';
import { Activity } from '@/lib/core/activity';
import { ActivityRowInActivityPage } from '@/components/activities/ActivityRowInActivityPage';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { useActivityStore } from '@/store/useActivityStore';

export default function ActivitiesPage() {
  const activities = useActivityStore((state) => state.activitiesByDate);
  const isLoadingActivities = useActivityStore((state) => state.isLoading);
  const resetAll = useActivityStore((state) => state.resetAll);
  const allEntries = Object.entries(activities);
  allEntries.sort(([aKey], [bKey]) => bKey.localeCompare(aKey));

  const entriesByDates = useMemo(
    () =>
      allEntries.map(([date, dateActivities]) => ({
        date,
        activities: dateActivities,
      })),
    [allEntries]
  );

  const renderDateEntries = useMemo(() => {
    return ({ item }: { item: { date: string; activities: Activity[] } }) => (
      <DateItemComponent date={item.date} activities={item.activities} />
    );
  }, []);

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
    <View className='flex-1'>
      <FlatList
        data={entriesByDates}
        renderItem={renderDateEntries}
        keyExtractor={(item) => item.date}
        initialNumToRender={2}
        maxToRenderPerBatch={2}
        windowSize={5}
        ListFooterComponent={
          <View className='my-4 flex flex-row items-center justify-center py-4'>
            <Button variant={'destructive'} onPress={resetAll}>
              <Text>RESET ALL</Text>
            </Button>
          </View>
        }
      />
    </View>
  );
}

const DateItemComponent = memo(
  ({ date, activities }: { date: string; activities: Activity[] }) => (
    <View className='w-full gap-4 pt-4'>
      <Text className='rounded-md bg-secondary py-2 text-center text-xl font-bold'>
        {date}
      </Text>
      <SortedActivityDisplay activities={activities} />
    </View>
  )
);

const SortedActivityDisplay = memo(
  ({ activities }: { activities: Activity[] }) => {
    const sortedActivities = useMemo(() => {
      return [...activities].sort((a, b) => {
        if (a.start > b.start) return -1;
        if (a.start < b.start) return 1;
        return 0;
      });
    }, [activities]);

    const renderEntries = useMemo(() => {
      return ({ item }: { item: Activity }) => (
        <ActivityRowInActivityPage key={item.id} activity={item} />
      );
    }, []);

    return (
      <FlatList
        data={sortedActivities}
        renderItem={renderEntries}
        keyExtractor={(item) => item.id}
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        windowSize={20}
      />
    );
  }
);
