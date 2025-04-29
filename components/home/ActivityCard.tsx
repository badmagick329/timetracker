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
        'flex flex-col gap-8 border-white/40 border-2 rounded-lg px-4 pt-2 pb-6 w-full',
        cardClassName
      )}
    >
      <View
        className={clsx(
          'flex flex-row w-full border-b-2 border-white items-center gap-4 justify-between',
          headerClassName
        )}
      >
        {header}
      </View>
      {content}
    </View>
  );
}
