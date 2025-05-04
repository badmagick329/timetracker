import * as FileSystem from 'expo-file-system';
import { AppSettings } from '@/lib/core/app-settings';
import { IAppSettingsRepository } from '@/lib/core/iapp-settings-repository';
import { TimeOnly } from '@/lib/core/time-only';
import { AppSettingsParams } from '@/lib/types';

export class AppSettingsJsonStorage implements IAppSettingsRepository {
  private saveFile: string;
  private _appSettings: AppSettings;

  constructor(saveFile: string, appSettings: AppSettings) {
    this._appSettings = appSettings;
    this.saveFile = saveFile;
  }

  static async create(): Promise<AppSettingsJsonStorage> {
    const saveDir = `${FileSystem.documentDirectory}Json/`;
    const saveFile = `${saveDir}app-settings.json`;
    await FileSystem.makeDirectoryAsync(saveDir, {
      intermediates: true,
    });
    const settings = await AppSettingsJsonStorage.load(saveFile);
    return new AppSettingsJsonStorage(saveFile, settings);
  }

  get appSettings() {
    return this._appSettings;
  }

  async saveChanges(
    appSettingsParams: AppSettingsParams
  ): Promise<AppSettings> {
    if (appSettingsParams.logicalDateCutOff) {
      this._appSettings = this._appSettings.copyWith(appSettingsParams);
    } else {
      console.warn('No settings to update');
      return this._appSettings;
    }
    await this.save();
    return this._appSettings;
  }

  async reset(): Promise<void> {
    this._appSettings = AppSettings.defaultSettings();
    await this.save();
  }

  private static async load(saveFile: string): Promise<AppSettings> {
    const info = await FileSystem.getInfoAsync(saveFile);
    if (!info.exists) {
      return AppSettings.defaultSettings();
    }

    try {
      const json = await FileSystem.readAsStringAsync(saveFile);
      const parsedSettings = JSON.parse(json);
      return AppSettings.create(
        TimeOnly.fromHMS(parsedSettings.logicalDateCutOff)
      );
    } catch (error) {
      console.error(`Error loading settings from ${saveFile}:`, error);
      return AppSettings.defaultSettings();
    }
  }

  private async save(): Promise<void> {
    try {
      await FileSystem.writeAsStringAsync(
        this.saveFile,
        JSON.stringify(this._appSettings.toJSON())
      );
    } catch (error) {
      console.error(`Error saving settings to ${this.saveFile}:`, error);
    }
  }
}
