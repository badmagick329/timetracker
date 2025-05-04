import { Link, LinkProps } from 'expo-router';
import React, { useState } from 'react';
import DatePicker from 'react-native-date-picker';
import { ScrollContainer } from '@/components/ui/Containers';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';

export default function SettingsPage() {
  const [date, setDate] = useState(new Date());
  const [open, setOpen] = useState(false);

  return (
    <ScrollContainer className='gap-8 px-8'>
      <SettingLink href='/CategoryPage' label='Category Picker' />

      <Button className='w-full bg-primary/60' onPress={() => setOpen(true)}>
        <Text>Pick logical date cut off</Text>
      </Button>

      <DatePicker
        modal
        open={open}
        date={date}
        mode='time'
        onConfirm={(date) => {
          setOpen(false);
          setDate(date);
        }}
        onCancel={() => {
          setOpen(false);
        }}
      />
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
