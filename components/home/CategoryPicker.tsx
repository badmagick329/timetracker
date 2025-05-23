import { useEffect, useState } from 'react';
import { ScrollView } from 'react-native-gesture-handler';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Category } from '@/lib/core/category';
import { DisplayedCategory } from '@/lib/types';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Text } from '@/components/ui/text';
import { useActivityStore } from '@/store/useActivityStore';

export function CategoryPicker({
  displayedCategories,
  onValueChange,
  selectedCategory,
}: {
  displayedCategories: DisplayedCategory[];
  onValueChange: (option: DisplayedCategory | undefined) => void;
  selectedCategory?: Category;
}) {
  const [selectedDisplayedCategory, setSelectedDisplayedCategory] = useState<
    DisplayedCategory | undefined
  >(undefined);
  const activityInProgress = useActivityStore(
    (state) => state.activityInProgress
  );
  const canStart = activityInProgress === undefined;

  const insets = useSafeAreaInsets();
  const contentInsets = {
    top: insets.top,
    bottom: insets.bottom,
    left: 12,
    right: 12,
  };

  useEffect(() => {
    let defaultCategory;
    const match = displayedCategories.find(
      (c) => c.value === selectedCategory?.id
    );
    if (match) {
      defaultCategory = match;
    } else {
      defaultCategory = {
        label: 'Select a category',
        value: '',
      };
    }

    setSelectedDisplayedCategory(defaultCategory);
  }, [displayedCategories, selectedCategory]);

  if (displayedCategories.length === 0) {
    return <Text>No categories created</Text>;
  }

  return (
    <Select
      onValueChange={(option) => {
        onValueChange(option);
        setSelectedDisplayedCategory(option);
      }}
      value={selectedDisplayedCategory}
    >
      <SelectTrigger
        className='w-full bg-muted-foreground/20'
        disabled={!canStart}
      >
        <SelectValue
          className='native:text-lg text-sm text-foreground'
          placeholder='Select a category'
        />
      </SelectTrigger>
      <SelectContent insets={contentInsets} className='max-h-[80vh] w-full'>
        <ScrollView>
          <SelectGroup>
            {displayedCategories.map((c) => {
              return (
                <SelectItem key={c.value} label={c.label} value={c.value}>
                  {c.label}
                </SelectItem>
              );
            })}
          </SelectGroup>
        </ScrollView>
      </SelectContent>
    </Select>
  );
}
