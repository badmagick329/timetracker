import { create } from 'zustand';
import { combine } from 'zustand/middleware';
import { AppSettings } from '@/lib/core/app-settings';
import { IAppSettingsRepository } from '@/lib/core/iapp-settings-repository';
import { AppSettingsParams } from '@/lib/types';

type AppSettingsState = {
  appSettingsRepository?: IAppSettingsRepository;
  appSettings?: AppSettings;
  isLoading: boolean;
  isInitialized: boolean;
  error: string | null;
};

type AppSettingsAction = {
  initialize: (repository: IAppSettingsRepository) => Promise<void>;
  saveChanges: (appSettingsParams: AppSettingsParams) => Promise<void>;
  reset: () => Promise<void>;
};

const initialState: AppSettingsState = {
  appSettingsRepository: undefined,
  appSettings: undefined,
  isLoading: false,
  isInitialized: false,
  error: null,
};

export const useAppSettingsStore = create(
  combine<AppSettingsState, AppSettingsAction>(initialState, (set, get) => ({
    initialize: async (repository: IAppSettingsRepository) => {
      if (get().isInitialized || get().isLoading) {
        return;
      }

      set({ isLoading: true, error: null });

      try {
        const appSettings = repository.appSettings;

        set({
          appSettingsRepository: repository,
          appSettings: appSettings,
          isLoading: false,
          isInitialized: true,
          error: null,
        });
      } catch (err) {
        console.error('Failed to initialize app settings repository:', err);
        set({
          appSettingsRepository: undefined,
          appSettings: undefined,
          isLoading: false,
          isInitialized: true,
          error:
            err instanceof Error ? err.message : 'Unknown initialization error',
        });
      }
    },

    saveChanges: async (appSettingsParams: AppSettingsParams) => {
      const { appSettingsRepository } = get();
      if (!appSettingsRepository) {
        console.warn('No app settings repository available');
        return;
      }

      try {
        const newSettings =
          await appSettingsRepository.saveChanges(appSettingsParams);
        set({ appSettings: newSettings });
      } catch (error) {
        console.error('Error saving changes:', error);
      }
    },

    reset: async () => {
      const { appSettingsRepository } = get();
      if (!appSettingsRepository) {
        console.warn('No app settings repository available');
        return;
      }

      try {
        await appSettingsRepository.reset();
      } catch (error) {
        console.error('Error resetting settings:', error);
      }
    },
  }))
);
