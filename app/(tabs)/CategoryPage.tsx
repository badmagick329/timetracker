import { useState } from 'react';
import { View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
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
        <>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant='outline'>
                <Text>Edit Profile</Text>
              </Button>
            </DialogTrigger>
            <DialogContent className='sm:max-w-[425px]'>
              <DialogHeader>
                <DialogTitle>Edit profile</DialogTitle>
                <DialogDescription>
                  Make changes to your profile here. Click save when you're
                  done.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <DialogClose asChild>
                  <Button>
                    <Text>OK</Text>
                  </Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </>
        {categories.map((c) => {
          return (
            <View className='flex flex-row justify-between gap-2' key={c.id}>
              <Text>{c.name}</Text>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant='outline' disabled={ioInProgress}>
                    <Text>Delete</Text>
                  </Button>
                </DialogTrigger>
                <DialogContent className='sm:max-w-[425px]'>
                  <DialogHeader>
                    <DialogTitle>Confirm Delete</DialogTitle>
                    <DialogDescription>
                      Are you sure you want to delete this category? This action
                      cannot be undone.
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <DialogClose asChild>
                      <View className='flex flex-row justify-end'>
                        <Button
                          variant={'destructive'}
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
                          <Text>Yes</Text>
                        </Button>
                      </View>
                    </DialogClose>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </View>
          );
        })}
        <View className='flex w-full flex-col gap-4 pt-8'>
          <View className='flex flex-row justify-between gap-2'>
            <Input
              placeholder='Write some stuff...'
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
    </ScrollView>
  );
}
