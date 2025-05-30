import { useState } from 'react';
import { View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { DialogComponent } from '@/components/ui/DialogComponent';
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
    <ScrollView>
      <View className='flex w-full flex-1 flex-col gap-2 px-8'>
        <View className='flex w-full flex-col gap-4 pt-8'>
          <View className='flex flex-row justify-between gap-2'>
            <Input
              placeholder='Category name'
              value={categoryText}
              onChangeText={setCategoryText}
              aria-labelledby='inputLabel'
              aria-errormessage='inputError'
              className='grow border-2 border-solid border-cyan-400/40 focus-visible:border-cyan-400'
            />
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
          </View>
          <View className='flex flex-col items-center gap-4'>
            <DialogComponent
              isEnabled={!(ioInProgress || categories.length === 0)}
              buttonText='Reset All'
              description='Are you sure you want to reset all categories? This action cannot be undone.'
              dialogTitle='Confirm Reset'
              confirmationText='Yes'
              onConfirm={async () => {
                try {
                  setIoInProgress(true);
                  await resetCategories();
                } finally {
                  setIoInProgress(false);
                }
              }}
            />
          </View>
        </View>
        {categories.map((c) => {
          return (
            <View className='flex flex-row justify-between gap-2' key={c.id}>
              <Text>{c.name}</Text>
              <DialogComponent
                isEnabled={ioInProgress === false}
                buttonText='Delete'
                description='Are you sure you want to delete this category? This action cannot be undone.'
                dialogTitle='Confirm Delete'
                confirmationText='Yes'
                onConfirm={async () => {
                  try {
                    setIoInProgress(true);
                    await removeCategory(c.id);
                  } finally {
                    setIoInProgress(false);
                  }
                }}
              />
            </View>
          );
        })}
      </View>
    </ScrollView>
  );
}
