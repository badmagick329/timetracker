import { useState } from 'react';
import { View } from 'react-native';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Text } from '@/components/ui/text';
import { useCategoryStore } from '@/store/useCategoryStore';

export default function CategoryPage() {
  const createCategory = useCategoryStore((state) => state.createCategory);
  const removeCategory = useCategoryStore((state) => state.removeCategory);
  const [categoryText, setCategoryText] = useState('');
  const categories = useCategoryStore((state) => state.categories);
  const resetCategories = useCategoryStore((state) => state.reset);
  const [ioInProgress, setIoInProgress] = useState(false);

  const isInitialized = useCategoryStore((state) => state.isInitialized);
  if (!isInitialized) {
    return null;
  }

  return (
    <View className='flex w-full flex-1 flex-col gap-2'>
      {categories.map((c) => {
        return (
          <View key={c.id}>
            <Text>{c.name}</Text>
            <Button
              onPress={async () => {
                try {
                  setIoInProgress(true);
                  await removeCategory(c.id);
                } finally {
                  setIoInProgress(false);
                }
              }}
              disabled={ioInProgress}
            >
              <Text>Delete</Text>
            </Button>
          </View>
        );
      })}
      <View className='flex w-full flex-col gap-4 pt-8'>
        <Input
          placeholder='Write some stuff...'
          value={categoryText}
          onChangeText={setCategoryText}
          aria-labelledby='inputLabel'
          aria-errormessage='inputError'
          className='border-2 border-solid border-cyan-400'
        />
        <View className='flex flex-col gap-4'>
          <Button
            onPress={async () => {
              try {
                setIoInProgress(true);
                await createCategory(categoryText.trim());
                setCategoryText('');
              } finally {
                setIoInProgress(false);
              }
            }}
            disabled={ioInProgress || categoryText.trim() === ''}
          >
            <Text>Add</Text>
          </Button>
          <Button
            onPress={async () => {
              try {
                setIoInProgress(true);
                await resetCategories();
              } finally {
                setIoInProgress(false);
              }
            }}
            variant={'destructive'}
            disabled={ioInProgress || categories.length === 0}
          >
            <Text>RESET ALL</Text>
          </Button>
        </View>
      </View>
    </View>
  );
}
