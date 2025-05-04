import { TimeOnly } from '@/lib/core/time-only';
import { AppSettingsParams } from '@/lib/types';

export class AppSettings {
  private _logicalDateCutOff: TimeOnly;

  private constructor(logicalDateCutOff: TimeOnly) {
    this._logicalDateCutOff = logicalDateCutOff;
  }

  get logicalDateCutOff() {
    return this._logicalDateCutOff;
  }

  static create(logicalDateCutOff: TimeOnly): AppSettings {
    return new AppSettings(logicalDateCutOff);
  }

  static defaultSettings(): AppSettings {
    return new AppSettings(TimeOnly.fromHMS('00:00:00'));
  }

  copyWith(appSettingsParams: AppSettingsParams) {
    const newSettings = new AppSettings(this._logicalDateCutOff);
    if (appSettingsParams.logicalDateCutOff) {
      newSettings._logicalDateCutOff = appSettingsParams.logicalDateCutOff;
    }
    return newSettings;
  }

  toJSON() {
    return {
      logicalDateCutOff: this._logicalDateCutOff.toString(),
    };
  }
}
