import clsx from 'clsx';
import { View } from 'react-native';

export function ActivityCard({
  header,
  content,
  cardClassName = '',
  headerClassName = '',
}: {
  header: React.ReactNode;
  content: React.ReactNode;
  cardClassName?: string;
  headerClassName?: string;
}) {
  return (
    <View
      className={clsx(
        'flex w-full flex-col gap-8 rounded-lg border-2 border-foreground/40 px-4 pb-6 pt-2',
        cardClassName
      )}
    >
      <View
        className={clsx(
          'flex w-full flex-row items-center justify-between gap-4 border-b-2 border-foreground/80',
          headerClassName
        )}
      >
        {header}
      </View>
      {content}
    </View>
  );
}
