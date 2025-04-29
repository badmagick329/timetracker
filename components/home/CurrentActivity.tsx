import { View } from 'react-native';
import { Category } from '@/lib/core/category';
import { formattedDuration2, titleCase } from '@/lib/utils/index';
import { ActivityBar } from '@/components/home/ActivityBar';
import { ActivityCard } from '@/components/home/ActivityCard';
import { Text } from '@/components/ui/text';

export function CurrentActivity({
  category,
  startTime,
  endTime,
  duration,
}: {
  category?: Category;
  startTime?: Date;
  endTime?: Date;
  duration: number;
}) {
  // if not in progress
  if (!startTime || endTime || !category) {
    const showPlaceholder = false;
    return showPlaceholder ? (
      <ActivityCard
        header={
          <>
            <Text className='text-xl font-bold'>{'Placeholder'}</Text>
            <Text className='text-sm text-muted-foreground'>
              {formattedDuration2(50000)}
            </Text>
          </>
        }
        content={
          <ActivityBar
            endTimeEmptyContent={
              <View className='w-5 h-5 border-destructive/40 border-2 animate-bounce rounded-full bg-destructive/20'></View>
            }
            startTime={new Date()}
          />
        }
      />
    ) : null;
  }

  return (
    <ActivityCard
      header={
        <>
          <Text className='text-xl font-bold'>{titleCase(category.name)}</Text>
          <Text className='text-sm text-muted-foreground'>
            {formattedDuration2(duration)}
          </Text>
        </>
      }
      content={
        <ActivityBar
          endTimeEmptyContent={
            <View className='w-5 h-5 border-destructive/40 border-2 animate-bounce rounded-full bg-destructive/20'></View>
          }
          startTime={startTime}
        />
      }
    />
  );
}
