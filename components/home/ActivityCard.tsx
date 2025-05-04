import clsx from 'clsx';
import { View } from 'react-native';

export function ActivityCardWrapper({
  className = '',
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <View
      className={clsx(
        'flex w-full flex-col gap-8 rounded-lg border-2 border-foreground/40 px-4 pb-6 pt-2',
        className
      )}
    >
      {children}
    </View>
  );
}

export function ActivityCardHeader({
  className = '',
  children,
}: {
  className?: string;
  children: React.ReactNode | string;
}) {
  return (
    <View
      className={clsx(
        'flex w-full flex-row items-center justify-between gap-4 border-b-2 border-foreground/80',
        className
      )}
    >
      {children}
    </View>
  );
}

export function ActivityCardContent({
  className = '',
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return <View className={className}>{children}</View>;
}
