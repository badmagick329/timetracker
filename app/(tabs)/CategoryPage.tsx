import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Text } from '@/components/ui/text';
import { useCategoryStore } from '@/store/useCategoryStore';
import { useState } from 'react';
import { View } from 'react-native';

export default function CategoryPage() {
  const createCategory = useCategoryStore((state) => state.createCategory);
  const removeCategory = useCategoryStore((state) => state.removeCategory);
  const [categoryText, setCategoryText] = useState('');
  const categories = useCategoryStore((state) => state.categories);
  const resetCategories = useCategoryStore((state) => state.reset);

  const isInitialized = useCategoryStore((state) => state.isInitialized);
  if (!isInitialized) {
    return null;
  }

  return (
    <View className='flex flex-col w-full flex-1 gap-2'>
      {categories.map((c) => {
        return (
          <View key={c.id}>
            <Text>{c.name}</Text>
            <Button
              onPress={() => {
                removeCategory(c.id);
              }}
            >
              <Text>Delete</Text>
            </Button>
          </View>
        );
      })}
      <View className='flex flex-col w-full pt-8 gap-4'>
        <Input
          placeholder='Write some stuff...'
          value={categoryText}
          onChangeText={setCategoryText}
          aria-labelledby='inputLabel'
          aria-errormessage='inputError'
          className='border-solid border-2 border-cyan-400'
        />
        <View className='flex flex-col gap-4'>
          <Button
            onPress={() => {
              createCategory(categoryText);
              setCategoryText('');
            }}
          >
            <Text>Add</Text>
          </Button>
          <Button
            onPress={() => {
              resetCategories();
            }}
            variant={'destructive'}
          >
            <Text>RESET ALL</Text>
          </Button>
        </View>
      </View>
    </View>
  );
}
