import { Category } from './category';
import { Timespan } from './timespan';

export class Activity {
  private timespan: Timespan;
  readonly category: Category;
  readonly summary: string;
  id: string;
  next: Activity | undefined;
  previous: Activity | undefined;

  constructor({
    timespan,
    category,
    summary = '',
    id = '',
    next = undefined,
    previous = undefined,
  }: {
    timespan: Timespan;
    category: Category;
    summary?: string;
    id?: string;
    next?: Activity | undefined;
    previous?: Activity | undefined;
  }) {
    this.timespan = timespan;
    this.category = category;
    this.summary = summary;
    this.id = id;
    this.next = next;
    this.previous = previous;
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

  get isInProgress() {
    return this.end === undefined;
  }

  completeActivity(endTime: Date) {
    if (!this.isInProgress) {
      console.error('Activity is already completed:', this);
      throw new Error('Activity is already completed');
    }
    this.timespan.end = endTime;
  }

  cloneWith({ start, end }: { start?: Date; end?: Date | undefined }) {
    return new Activity({
      timespan: Timespan.create(
        start || this.start,
        this.logicalDate,
        end || this.end
      ),
      category: Category.create(this.category.name, this.category.id),
      summary: this.summary,
      id: this.id,
      next: this.next,
      previous: this.previous,
    });
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
