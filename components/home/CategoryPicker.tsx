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

export default function CategoryPicker({
  categories,
  onValueChange,
}: {
  categories: DisplayedCategory[];
  onValueChange: (option: DisplayedCategory | undefined) => void;
}) {
  if (categories.length === 0) {
    categories = [{ value: 'other', label: 'Other' }];
  }

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
          {categories.map((c) => {
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
