import { Activity } from '@/lib/core/activity';
import { formattedDuration2, titleCase } from '@/lib/utils/index';
import { ActivityBar } from '@/components/home/ActivityBar';
import { ActivityCard } from '@/components/home/ActivityCard';
import { Text } from '@/components/ui/text';

export function LastActivity({ activity }: { activity?: Activity }) {
  if (!activity) {
    return null;
  }

  return (
    <ActivityCard
      header={
        <>
          <Text className='font-bold text-xl'>
            {titleCase(activity.category.name)}
          </Text>
          <Text className='font-bold text-sm text-muted-foreground'>
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
