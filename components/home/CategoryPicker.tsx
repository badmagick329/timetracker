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
import { Category } from '@/lib/types';

export default function CategoryPicker({
  categories,
}: {
  categories: Category[];
}) {
  if (categories.length === 0) {
    categories = [{ value: 'other', label: 'Other' }];
  }
  const insets = useSafeAreaInsets();
  const contentInsets = {
    top: insets.top,
    bottom: insets.bottom,
    left: 12,
    right: 12,
  };

  return (
    <Select>
      <SelectTrigger className='w-[250px] bg-muted-foreground/20'>
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
