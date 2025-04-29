import '@/global.css';
import { useState } from 'react';
import { View } from 'react-native';
import { Category } from '@/lib/core/category';
import { CurrentActivityControl } from '@/components/home/CurrentActivityControl';
import { RecentActivityInfo } from '@/components/home/RecentActivityInfo';

export default function Index() {
  return (
    <View className='flex flex-1 flex-col items-center gap-24 bg-background pt-8'>
      <CurrentActivityControl />
      <RecentActivityInfo />
    </View>
  );
}
