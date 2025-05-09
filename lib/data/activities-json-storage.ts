import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { Activity } from '@/lib/core/activity';
import { Category } from '@/lib/core/category';
import { DateOnly } from '@/lib/core/date-only';
import { IActivitiesRepository } from '@/lib/core/iactivities-repository';
import { Timespan } from '@/lib/core/timespan';
import { JsonParsedActivity } from '@/lib/types';

export class ActivitiesJsonStorage implements IActivitiesRepository {
  private static readonly saveDir = `${FileSystem.documentDirectory}Json/`;
  private static readonly saveFile = `${ActivitiesJsonStorage.saveDir}activities.json`;

  private _activities: Activity[];

  private constructor(activities: Activity[]) {
    this._activities = activities;
  }

  static async create(): Promise<ActivitiesJsonStorage> {
    await FileSystem.makeDirectoryAsync(ActivitiesJsonStorage.saveDir, {
      intermediates: true,
    });
    const activities = await this.load();

    return new ActivitiesJsonStorage(activities);
  }

  get activities(): Activity[] {
    return this._activities;
  }

  async addActivity(activity: Activity): Promise<string> {
    const start = performance.now();
    this._activities.push(activity);
    activity.id = activity.start.toString();
    await this.save();
    console.log(
      `[ActivitiesJsonStorage] - Add activity took ${performance.now() - start} milliseconds`
    );
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
      this._activities[index] = new Activity({
        timespan: Timespan.create(
          activity.start,
          activity.logicalDate,
          activity.end
        ),
        category: Category.create(activity.category.name, activity.category.id),
        summary: activity.summary,
        id: activity.id,
        next: activity.next,
        previous: activity.previous,
      });
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
      await FileSystem.deleteAsync(ActivitiesJsonStorage.saveFile, {
        idempotent: true,
      });
      console.log(
        'All activities reset and file deleted:',
        ActivitiesJsonStorage.saveFile
      );
    } catch (error) {
      console.error('Error resetting activities:', error);
    }
  }

  static async exportJsonData() {
    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(ActivitiesJsonStorage.saveFile);
    } else {
      alert('Sharing is not available on this device');
    }
  }

  private static async load(): Promise<Activity[]> {
    const info = await FileSystem.getInfoAsync(ActivitiesJsonStorage.saveFile);
    if (!info.exists) {
      return [];
    }

    try {
      const fileContent = await FileSystem.readAsStringAsync(
        ActivitiesJsonStorage.saveFile
      );
      // console.log(`File contents read:\n${fileContent}`);
      const activities = JSON.parse(fileContent) as JsonParsedActivity[];
      // console.log('parsed data', activities);

      const loaded = activities.map((activity, idx) => {
        const created = ActivitiesJsonStorage.jsonToInstance(activity);
        if (idx > 0) {
          created.previous = ActivitiesJsonStorage.jsonToInstance(
            activities[idx - 1]
          );
        }
        if (idx < activities.length - 1) {
          created.next = ActivitiesJsonStorage.jsonToInstance(
            activities[idx + 1]
          );
        }

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
      // console.log('Saving\n', fileContent);
      await FileSystem.writeAsStringAsync(
        ActivitiesJsonStorage.saveFile,
        fileContent
      );
      console.log('Activities saved to file:', ActivitiesJsonStorage.saveFile);
    } catch (error) {
      console.error('Error saving activities to file:', error);
    }
  }

  private static jsonToInstance(parsed: JsonParsedActivity) {
    return new Activity({
      timespan: Timespan.create(
        new Date(parsed.timespan.start),
        new DateOnly(new Date(parsed.timespan.logicalDate)),
        parsed.timespan.end !== '' ? new Date(parsed.timespan.end) : undefined
      ),
      category: Category.create(parsed.category.name, parsed.category.id),
      id: parsed.id,
    });
  }
}
