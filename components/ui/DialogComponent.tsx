import { View } from 'react-native';
import { Button, ButtonVariants } from '@/components/ui/button';
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
import { Text } from '@/components/ui/text';

export function DialogComponent({
  isEnabled,
  buttonText,
  description,
  dialogTitle,
  confirmationText = 'Yes',
  onConfirm,
  buttonVariant = {
    variant: 'default',
    size: 'default',
  },
}: {
  isEnabled: boolean;
  buttonText: string;
  description: string;
  dialogTitle: string;
  confirmationText?: string;
  onConfirm: () => void;
  buttonVariant?: ButtonVariants;
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant={buttonVariant.variant}
          size={buttonVariant.size}
          disabled={!isEnabled}
        >
          <Text>{buttonText}</Text>
        </Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>{dialogTitle}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <View className='flex flex-row justify-end'>
              <Button
                variant={'destructive'}
                onPress={onConfirm}
                disabled={!isEnabled}
              >
                <Text>{confirmationText}</Text>
              </Button>
            </View>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
