import clsx from 'clsx';
import { View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';

export function MainContainer({
  className,
  children,
}: {
  className: string;
  children: React.ReactNode;
}) {
  return (
    <View className={clsx('flex w-full flex-1 flex-col px-8', className)}>
      {children}
    </View>
  );
}

export function Container({
  className,
  children,
}: {
  className: string;
  children: React.ReactNode;
}) {
  return (
    <View className={clsx('flex w-full flex-col', className)}>{children}</View>
  );
}

export function ScrollContainer({
  className,
  children,
}: {
  className: string;
  children: React.ReactNode;
}) {
  return (
    <ScrollView>
      <Container className={className}>{children}</Container>
    </ScrollView>
  );
}
