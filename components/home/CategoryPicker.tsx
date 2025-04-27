import { ScrollView } from 'react-native-gesture-handler';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { DisplayedCategory } from '@/lib/types';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Text } from '@/components/ui/text';
import { useTimerStore } from '@/store/useTimerStore';

export default function CategoryPicker({
  displayedCategories,
  onValueChange,
}: {
  displayedCategories: DisplayedCategory[];
  onValueChange: (option: DisplayedCategory | undefined) => void;
}) {
  const canStart = useTimerStore((state) => state.canStart);

  const insets = useSafeAreaInsets();
  const contentInsets = {
    top: insets.top,
    bottom: insets.bottom,
    left: 12,
    right: 12,
  };

  if (displayedCategories.length === 0) {
    return <Text>No categories created</Text>;
  }

  return (
    <Select onValueChange={onValueChange}>
      <SelectTrigger
        className='w-[250px] bg-muted-foreground/20'
        disabled={!canStart()}
      >
        <SelectValue
          className='text-foreground text-sm native:text-lg'
          placeholder='Select a category'
        />
      </SelectTrigger>
      <SelectContent insets={contentInsets} className='w-[250px]'>
        <ScrollView className='max-h-[25vh]'>
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
