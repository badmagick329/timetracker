import { useEffect } from 'react';
import { LayoutChangeEvent, PressableProps } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { Button } from '@/components/ui/button';

const AnimatedButton = Animated.createAnimatedComponent(Button);

interface Props extends PressableProps {
  rounded: boolean;
  children: React.ReactNode;
}

const defaultHeight = 6;

export function MorphingButton({
  rounded = false,
  children,
  style,
  ...rest
}: Props) {
  const radius = useSharedValue(defaultHeight);

  const height = useSharedValue(0);
  const onLayout = (e: LayoutChangeEvent) => {
    height.value = e.nativeEvent.layout.height;
    // initialize radius if height was zero initially
    radius.value = rounded ? height.value / 2 : defaultHeight;
  };

  useEffect(() => {
    const target = rounded
      ? height.value > 0
        ? height.value / 2
        : 20
      : defaultHeight;
    radius.value = withTiming(target, {
      duration: 200,
    });
  }, [rounded, height, radius]);

  const animatedStyle = useAnimatedStyle(() => ({
    borderRadius: radius.value,
  }));

  return (
    <AnimatedButton
      {...rest}
      onLayout={onLayout}
      style={[animatedStyle, style]}
    >
      {children}
    </AnimatedButton>
  );
}
