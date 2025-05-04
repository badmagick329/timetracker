import { Link, LinkProps } from 'expo-router';
import { LogicalDatePicker } from '@/components/settings/LogicalDatePicker';
import { ScrollContainer } from '@/components/ui/Containers';

export default function SettingsPage() {
  return (
    <ScrollContainer className='gap-8 px-8'>
      <SettingLink href='/CategoryPage' label='Category Picker' />
      <LogicalDatePicker />
    </ScrollContainer>
  );
}

function SettingLink({
  href,
  label,
}: {
  href: LinkProps['href'];
  label: string;
}) {
  return (
    <Link
      href={href}
      className='w-full rounded-md bg-primary/60 px-8 py-4 text-center text-foreground'
    >
      {label}
    </Link>
  );
}
