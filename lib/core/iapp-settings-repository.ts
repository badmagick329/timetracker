import { AppSettings } from '@/lib/core/app-settings';
import { AppSettingsParams } from '@/lib/types';

export interface IAppSettingsRepository {
  appSettings: AppSettings;
  saveChanges(appSettingsParams: AppSettingsParams): Promise<AppSettings>;
  reset(): Promise<void>;
}
