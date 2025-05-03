import { Link, LinkProps } from 'expo-router';
import React from 'react';
import { View } from 'react-native';
import { AnimationExample } from '@/components/examples/AnimationExample';

export default function SettingsPage() {
  return (
    <View className='flex w-full flex-1 flex-col gap-2'>
      <SettingLink href='/CategoryPage' label='Category Picker' />
    </View>
  );
}

function SettingLink({
  href,
  label,
}: {
  href: LinkProps['href'];
  label: string;
}) {
  return (
    <Link
      href={href}
      className='w-full rounded-md bg-primary/20 px-8 py-4 text-center text-foreground'
    >
      {label}
    </Link>
  );
}
