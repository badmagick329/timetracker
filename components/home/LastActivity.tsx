import { formattedDuration2, titleCase } from '@/lib/utils/index';
import { ActivityBar } from '@/components/home/ActivityBar';
import { ActivityCard } from '@/components/home/ActivityCard';
import { Text } from '@/components/ui/text';
import { useActivityStore } from '@/store/useActivityStore';

export function LastActivity() {
  const activity = useActivityStore((state) => state.lastCompletedActivity);

  if (!activity) {
    return null;
  }

  if (activity.duration === undefined) {
    console.error('Activity duration is undefined');
    return null;
  }

  return (
    <ActivityCard
      header={
        <>
          <Text className='text-xl font-bold'>
            {titleCase(activity.category.name)}
          </Text>
          <Text className='text-sm font-bold text-muted-foreground'>
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
