import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { DisplayedCategory } from '@/lib/types';
import { useTimerStore } from '@/store/useTimerStore';
import { Text } from '../ui/text';

export default function CategoryPicker({
  displayedCategories,
  onValueChange,
}: {
  displayedCategories: DisplayedCategory[];
  onValueChange: (option: DisplayedCategory | undefined) => void;
}) {
  const startTime = useTimerStore((state) => state.startTime);
  const endTime = useTimerStore((state) => state.endTime);
  const canStart = startTime === undefined && endTime === undefined;

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
        disabled={!canStart}
      >
        <SelectValue
          className='text-foreground text-sm native:text-lg'
          placeholder='Select a category'
        />
      </SelectTrigger>
      <SelectContent insets={contentInsets} className='w-[250px]'>
        <SelectGroup>
          <SelectLabel>Categories</SelectLabel>
          {displayedCategories.map((c) => {
            return (
              <SelectItem key={c.value} label={c.label} value={c.value}>
                {c.label}
              </SelectItem>
            );
          })}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
