import '@/global.css';
import {
  DarkTheme,
  DefaultTheme,
  Theme,
  ThemeProvider,
} from '@react-navigation/native';
import { PortalHost } from '@rn-primitives/portal';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Platform } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { NAV_THEME } from '@/lib/constants';
import { ActivitiesJsonStorage } from '@/lib/data/activities-json-storage';
import { AppSettingsJsonStorage } from '@/lib/data/app-settings-json-storage';
import { CategoriesJsonStorage } from '@/lib/data/categories-json-storage';
import { useColorScheme } from '@/lib/useColorScheme';
import { useActivityStore } from '@/store/useActivityStore';
import { useAppSettingsStore } from '@/store/useAppSettingsStore';
import { useCategoryStore } from '@/store/useCategoryStore';

const LIGHT_THEME: Theme = {
  ...DefaultTheme,
  colors: NAV_THEME.light,
};
const DARK_THEME: Theme = {
  ...DarkTheme,
  colors: NAV_THEME.dark,
};

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

export default function RootLayout() {
  const hasMounted = useRef(false);
  const { colorScheme, isDarkColorScheme } = useColorScheme();
  const [isColorSchemeLoaded, setIsColorSchemeLoaded] = useState(false);
  const initializeActivityStore = useActivityStore((state) => state.initialize);
  const initialCategoryStore = useCategoryStore((state) => state.initialize);
  const initializeAppSettingsStore = useAppSettingsStore(
    (state) => state.initialize
  );

  useIsomorphicLayoutEffect(() => {
    if (hasMounted.current) {
      return;
    }

    if (Platform.OS === 'web') {
      // Adds the background color to the html element to prevent white background on overscroll.
      document.documentElement.classList.add('bg-background');
    }
    setIsColorSchemeLoaded(true);
    hasMounted.current = true;
  }, []);

  useEffect(() => {
    (async () => {
      initializeActivityStore(await ActivitiesJsonStorage.create());
      initialCategoryStore(await CategoriesJsonStorage.create());
      initializeAppSettingsStore(await AppSettingsJsonStorage.create());
    })();
  }, [
    initializeActivityStore,
    initialCategoryStore,
    initializeAppSettingsStore,
  ]);

  if (!isColorSchemeLoaded) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider value={isDarkColorScheme ? DARK_THEME : LIGHT_THEME}>
        <StatusBar style={isDarkColorScheme ? 'light' : 'dark'} />
        <Stack>
          <Stack.Screen name='(tabs)' options={{ headerShown: false }} />
        </Stack>
        <PortalHost />
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}

const useIsomorphicLayoutEffect =
  Platform.OS === 'web' && typeof window === 'undefined'
    ? useEffect
    : useLayoutEffect;
