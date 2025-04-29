import * as FileSystem from 'expo-file-system';
import { Activity } from '@/lib/core/activity';
import { Category } from '@/lib/core/category';
import { DateOnly } from '@/lib/core/date-only';
import { IActivitiesRepository } from '@/lib/core/iactivities-repository';
import { Timespan } from '@/lib/core/timespan';
import { JsonParsedActivity } from '@/lib/types';

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
      // console.log(`File contents read:\n${fileContent}`);
      const activities = JSON.parse(fileContent) as JsonParsedActivity[];
      // console.log('parsed data', activities);

      const loaded = activities.map((activity) => {
        const { start, end, logicalDate } = activity.timespan;

        const created = new Activity({
          timespan: Timespan.create(
            new Date(start),
            new DateOnly(new Date(logicalDate)),
            end !== '' ? new Date(end) : undefined
          ),
          category: Category.create(
            activity.category.name,
            activity.category.id
          ),
          id: activity.id,
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
