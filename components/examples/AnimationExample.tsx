import React from 'react';
import { View } from 'react-native';
import Animated, {
  runOnUI,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';

const STEP = 50;
const MIN = 50;
const MAX = 500;
const DURATION = 250;

export function AnimationExample() {
  const sizeh = useSharedValue(100);
  const minusIsPressed = useSharedValue(false);
  const plusIsPressed = useSharedValue(false);

  const style = useAnimatedStyle(() => ({
    height: sizeh.value,
  }));

  function decrementLoop(step: number, min: number) {
    'worklet';
    if (minusIsPressed.value && sizeh.value > min) {
      const target = Math.max(sizeh.value - step, min);
      sizeh.value = withTiming(target, { duration: DURATION }, (finished) => {
        if (finished) decrementLoop(step, min);
      });
    }
  }

  function incrementLoop(step: number, max: number) {
    'worklet';
    if (plusIsPressed.value && sizeh.value < max) {
      const target = Math.min(sizeh.value + step, max);
      sizeh.value = withTiming(target, { duration: DURATION }, (finished) => {
        if (finished) incrementLoop(step, max);
      });
    }
  }

  const handleMinusPressIn = () => {
    minusIsPressed.value = true;
    runOnUI(() => decrementLoop(STEP, MIN))();
  };
  const handleMinusPressOut = () => {
    minusIsPressed.value = false;
  };

  const handlePlusPressIn = () => {
    plusIsPressed.value = true;
    runOnUI(() => incrementLoop(STEP, MAX))();
  };

  const handlePlusPressOut = () => {
    plusIsPressed.value = false;
  };

  return (
    <Animated.View
      className={'bg-red-400'}
      style={[
        {
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        },
        style,
      ]}
    >
      <View className='flex flex-row justify-center gap-4'>
        <Button
          onPress={() => {
            if (sizeh.value < MAX) {
              sizeh.value = withTiming(Math.min(sizeh.value + STEP, MAX), {
                duration: DURATION,
              });
            }
          }}
          onPressIn={handlePlusPressIn}
          onPressOut={handlePlusPressOut}
        >
          <Text>EMBIGGEN</Text>
        </Button>
        <Button
          onPress={() => {
            if (sizeh.value > MIN) {
              sizeh.value = withTiming(Math.max(sizeh.value - STEP, MIN), {
                duration: DURATION,
              });
            }
          }}
          onPressIn={handleMinusPressIn}
          onPressOut={handleMinusPressOut}
        >
          <Text>ENSMALLEN</Text>
        </Button>
      </View>
    </Animated.View>
  );
}
