import { Link, LinkProps } from 'expo-router';
import { View } from 'react-native';

export default function SettingsPage() {
  return (
    <View className='flex flex-col w-full flex-1 gap-2'>
      <SettingLink href='/CategoryPage' label='Category Picker' />
    </View>
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
      className='text-foreground bg-primary/20 px-8 py-4 text-center rounded-md w-full'
    >
      {label}
    </Link>
  );
}
