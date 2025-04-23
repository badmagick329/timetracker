import { Category } from './category';
import { Timespan } from './timespan';

export class Activity {
  private timespan: Timespan;
  private _category: Category;
  private summary: string;
  private _id: string;

  constructor({
    timespan,
    category,
    summary = '',
    id = '',
  }: {
    timespan: Timespan;
    category: Category;
    summary?: string;
    id?: string;
  }) {
    this.timespan = timespan;
    this._category = category;
    this.summary = summary;
    this._id = id;
  }

  get id() {
    return this._id;
  }

  set id(val) {
    this._id = val;
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

  get start() {
    return this.timespan.start;
  }

  get end() {
    return this.timespan.end;
  }

  toString(): string {
    return `${this.timespan.start}__${this.timespan.end}__${this.category}__${this.summary}`;
  }

  toJSON() {
    return {
      category: this.category,
      timespan: this.timespan,
      summary: this.summary,
      id: this.id,
    };
  }
}
