import { Activity } from '@/lib/core/activity';
import { IActivitiesRepository } from '@/lib/core/iactivities-repository';
import * as FileSystem from 'expo-file-system';
import { Timespan } from '@/lib/core/timespan';
import { DateOnly } from '@/lib/core/date-only';
import { Category } from '@/lib/core/category';

export class ActivitiesJsonStorage implements IActivitiesRepository {
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

  async addActivity(activity: Activity): Promise<string> {
    this._activities.push(activity);
    activity.id = activity.start.toString();
    console.log('Activity added:', activity);
    await this.save();
    return activity.id;
  }

  async removeActivity(activityId: string): Promise<string | undefined> {
    const index = this._activities.findIndex((a) => a.id === activityId);
    if (index === -1) {
      console.error('Activity not found for removal:', activityId);
      return undefined;
    }

    this._activities.splice(index, 1);
    console.log('Activity removed:', activityId);
    await this.save();
    return activityId;
  }

  async updateActivity(activity: Activity): Promise<boolean> {
    const index = this._activities.findIndex((a) => a.id === activity.id);
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

  getLastActivity(): Activity | undefined {
    if (this.activities.length === 0) {
      return undefined;
    }

    return this.activities.reduce((prev, current) => {
      return prev.end > current.end ? prev : current;
    });
  }

  async resetAll(): Promise<void> {
    this._activities = [];
    try {
      await FileSystem.deleteAsync(this.saveFile, { idempotent: true });
      console.log('All activities reset and file deleted:', this.saveFile);
    } catch (error) {
      console.error('Error resetting activities:', error);
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
        _id: string;
        timespan: {
          _start: string;
          _end: string;
          _logicalDate: { _value: string };
        };
        _category: { id: string; name: string };
        summary: string;
      }[];

      const loaded = activities.map((activity) => {
        const { _start, _end, _logicalDate } = activity.timespan;

        const created = new Activity({
          timespan: Timespan.create(
            new Date(_start),
            new Date(_end),
            new DateOnly(new Date(_logicalDate._value))
          ),
          category: Category.create(
            activity._category.name,
            activity._category.id
          ),
          id: activity._id,
        });
        return created;
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
      console.log('Saving\n', fileContent);
      await FileSystem.writeAsStringAsync(this.saveFile, fileContent);
      console.log('Activities saved to file:', this.saveFile);
    } catch (error) {
      console.error('Error saving activities to file:', error);
    }
  }
}
