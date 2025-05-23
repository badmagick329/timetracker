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

  tryGetClosestValidStart(targetDate: Date) {
    let minStart = this?.previous?.end;

    let maxStart;
    if (this.end) {
      maxStart = this.end;
    } else if (this.next?.start) {
      maxStart = this.next.start;
    }

    let newStart = new Date(this.start);
    newStart.setTime(targetDate.getTime());
    if (minStart && newStart < minStart) {
      newStart = minStart;
    } else if (maxStart && newStart > maxStart) {
      newStart = new Date(maxStart);
      newStart.setTime(newStart.getTime() - 1);
    }

    if (this.start.getTime() === newStart.getTime()) {
      return;
    }
    return newStart;
  }

  tryGetClosestValidEnd(targetDate: Date) {
    if (!this.end) {
      return;
    }

    let maxEnd = this.next?.start || new Date();
    let newEnd = new Date(this.end);
    newEnd.setTime(targetDate.getTime());
    if (newEnd < this.start) {
      newEnd = new Date(this.start);
      newEnd.setTime(newEnd.getTime() + 1);
    } else if (maxEnd && newEnd > maxEnd) {
      newEnd = maxEnd;
    }

    if (this.end.getTime() === newEnd.getTime()) {
      return;
    }
    return newEnd;
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
