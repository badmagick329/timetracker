import { Activity } from '../core/activity';
import { IActivitiesStorage } from '../core/iactivities-storage';
import * as FileSystem from 'expo-file-system';
import { Timespan } from '../core/timespan';
import { DateOnly } from '../core/date-only';
import { Category } from '../core/category';

export class ActivitiesJsonStorage implements IActivitiesStorage {
  private saveFile: string;
  private _activities: Activity[];

  private constructor(saveFile: string, activities: Activity[]) {
    this.saveFile = saveFile;
    this._activities = activities;
  }

  static async create(): Promise<ActivitiesJsonStorage> {
    const saveDir = `${FileSystem.documentDirectory}Json/`;
    const saveFile = `${saveDir}activities.json`;
    await FileSystem.makeDirectoryAsync(saveDir, {
      intermediates: true,
    });
    const activities = await this.load(saveFile);

    return new ActivitiesJsonStorage(saveFile, activities);
  }

  get activities(): Activity[] {
    return this._activities;
  }

  async addActivity(activity: Activity): Promise<void> {
    this._activities.push(activity);
    console.log('Activity added:', activity);
    await this.save();
  }

  async removeActivity(activityId: string): Promise<boolean> {
    const index = this._activities.findIndex(
      (a) => a.toString() === activityId
    );
    if (index === -1) {
      console.error('Activity not found for removal:', activityId);
      return false;
    }

    this._activities.splice(index, 1);
    console.log('Activity removed:', activityId);
    await this.save();
    return true;
  }

  async updateActivity(activity: Activity): Promise<boolean> {
    const index = this._activities.findIndex(
      (a) => a.toString() === activity.toString()
    );
    if (index !== -1) {
      this._activities[index] = activity;
      console.log('Activity updated:', activity);
      await this.save();
      return true;
    } else {
      console.error('Activity not found for update:', activity);
      return false;
    }
  }

  private static async load(saveFile: string): Promise<Activity[]> {
    const info = await FileSystem.getInfoAsync(saveFile);
    if (!info.exists) {
      return [];
    }

    try {
      const fileContent = await FileSystem.readAsStringAsync(saveFile);
      console.log(`File contents read:\n${fileContent}`);
      const activities = JSON.parse(fileContent) as {
        timespan: {
          _start: string;
          _end: string;
          _logicalDate: { _value: string };
        };
        _category: { name: string };
        summary: string;
      }[];

      const loaded = activities.map((activity) => {
        const { _start, _end, _logicalDate } = activity.timespan;
        const category = activity._category.name;

        const timespan = Timespan.create(
          new Date(_start),
          new Date(_end),
          new DateOnly(new Date(_logicalDate._value))
        );
        return new Activity(timespan, Category.create(category));
      });
      console.log(`Loaded ${loaded.length} activities`);

      return loaded;
    } catch (error) {
      console.error('Error loading activities from file:', error);
      return [];
    }
  }

  private async save(): Promise<void> {
    try {
      const fileContent = JSON.stringify(this._activities);
      await FileSystem.writeAsStringAsync(this.saveFile, fileContent);
      console.log('Activities saved to file:', this.saveFile);
    } catch (error) {
      console.error('Error saving activities to file:', error);
    }
  }
}
