import { Category } from './category';
import { Timespan } from './timespan';

export class Activity {
  private timespan: Timespan;
  private _category: Category;
  private summary: string;

  constructor(timespan: Timespan, category: Category, summary: string = '') {
    this.timespan = timespan;
    this._category = category;
    this.summary = summary;
  }

  get category() {
    return this._category;
  }

  get duration() {
    return this.timespan.duration;
  }

  get logicalDate() {
    return this.timespan.logicalDate;
  }

  // TODO: using this for ID for now. change later
  toString(): string {
    return `${this.timespan.start}__${this.timespan.end}__${this.category}__${this.summary}`;
  }
}
