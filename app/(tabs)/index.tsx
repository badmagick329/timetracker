import '@/global.css';
import { useState } from 'react';
import { View } from 'react-native';
import { Category } from '@/lib/core/category';
import { CurrentActivityControl } from '@/components/home/ActivityStarter';
import { RecentActivityInfo } from '@/components/home/RecentActivityInfo';

export default function Index() {
  const [selectedCategory, setSelectedCategory] = useState<
    Category | undefined
  >(undefined);

  return (
    <View className='flex pt-8 items-center flex-1 bg-background flex-col gap-24'>
      <CurrentActivityControl
        setSelectedCategory={setSelectedCategory}
        selectedCategory={selectedCategory}
      />
      <RecentActivityInfo category={selectedCategory} />
    </View>
  );
}
