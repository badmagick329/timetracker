import { useEffect, useState } from 'react';
import DatePicker from 'react-native-date-picker';
import { TimeOnly } from '@/lib/core/time-only';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { useAppSettingsStore } from '@/store/useAppSettingsStore';

export function LogicalDatePicker() {
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [open, setOpen] = useState(false);
  const settingsIsInitialized = useAppSettingsStore(
    (state) => state.isInitialized
  );
  const logicalDateCutOff = useAppSettingsStore(
    (state) => state.appSettings?.logicalDateCutOff
  );
  const saveChanges = useAppSettingsStore((state) => state.saveChanges);

  if (!settingsIsInitialized || !logicalDateCutOff) {
    return <Text>Loading...</Text>;
  }

  useEffect(() => {
    setDate(logicalDateCutOff.toDate());
  }, [settingsIsInitialized]);

  return (
    <>
      <Button className='w-full bg-primary/60' onPress={() => setOpen(true)}>
        <Text>
          Pick logical date cut off [{logicalDateCutOff.toHourAndMinutes()}]
        </Text>
      </Button>

      {date ? (
        <DatePicker
          modal
          open={open}
          date={date}
          mode='time'
          onConfirm={(date) => {
            (async () => {
              setOpen(false);
              setDate(date);
              if (!date) {
                return;
              }
              if (TimeOnly.fromDate(date) === logicalDateCutOff) {
                return;
              }
              await saveChanges({
                logicalDateCutOff: TimeOnly.fromDate(date),
              });
            })();
          }}
          onCancel={() => setOpen(false)}
        />
      ) : (
        <Text>No Date...</Text>
      )}
    </>
  );
}
