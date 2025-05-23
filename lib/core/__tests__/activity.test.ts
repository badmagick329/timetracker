import { Activity } from '../activity';
import { Category } from '../category';
import { DateOnly } from '../date-only';
import { Timespan } from '../timespan';

describe('Activity', () => {
  function createDate(dateString: string): Date {
    return new Date(dateString);
  }

  function createActivity(options: {
    start: Date;
    end?: Date;
    summary?: string;
    id?: string;
    next?: Activity;
    previous?: Activity;
  }): Activity {
    const logicalDate = new DateOnly(options.start);
    const category = Category.create('Work');
    const timespan = Timespan.create(options.start, logicalDate, options.end);

    return new Activity({
      timespan,
      category,
      summary: options.summary || 'Test activity',
      id: options.id || '',
      next: options.next,
      previous: options.previous,
    });
  }

  function linkActivities(previous: Activity, next: Activity): void {
    previous.next = next;
    next.previous = previous;
  }

  describe('tryGetClosestValidStart', () => {
    it('should return undefined if target date equals existing start', () => {
      const activity = createActivity({
        start: createDate('2025-04-17T10:00:00Z'),
        end: createDate('2025-04-17T12:00:00Z'),
      });
      const targetDate = new Date(activity.start.toString());

      const result = activity.tryGetClosestValidStart(targetDate);

      expect(result).toBeUndefined();
    });

    it('should adjust start time if it falls before previous activity end', () => {
      const previousActivity = createActivity({
        start: createDate('2025-04-17T08:00:00Z'),
        end: createDate('2025-04-17T09:30:00Z'),
      });

      const activity = createActivity({
        start: createDate('2025-04-17T10:00:00Z'),
        end: createDate('2025-04-17T12:00:00Z'),
        previous: previousActivity,
      });

      linkActivities(previousActivity, activity);

      const beforePreviousEnd = createDate('2025-04-17T09:00:00Z');

      const result = activity.tryGetClosestValidStart(beforePreviousEnd);

      expect(result).toEqual(previousActivity.end);
    });
    it('should adjust start time if it falls after the activity end', () => {
      const activity = createActivity({
        start: createDate('2025-04-17T10:00:00Z'),
        end: createDate('2025-04-17T12:00:00Z'),
      });
      const afterActivityEnd = createDate('2025-04-17T13:00:00Z');

      const result = activity.tryGetClosestValidStart(afterActivityEnd);
      const expectedResult = new Date(activity.end!);
      expectedResult.setTime(expectedResult.getTime() - 1);

      expect(result).toEqual(expectedResult);
    });

    it('should return the target date if it falls within valid range', () => {
      const previousActivity = createActivity({
        start: createDate('2025-04-17T08:00:00Z'),
        end: createDate('2025-04-17T09:00:00Z'),
      });

      const activity = createActivity({
        start: createDate('2025-04-17T10:00:00Z'),
        end: createDate('2025-04-17T12:00:00Z'),
      });

      const nextActivity = createActivity({
        start: createDate('2025-04-17T14:00:00Z'),
      });

      linkActivities(previousActivity, activity);
      linkActivities(activity, nextActivity);

      const withinValidRange = createDate('2025-04-17T11:00:00Z');

      const result = activity.tryGetClosestValidStart(withinValidRange);

      expect(result).toEqual(withinValidRange);
    });

    it('should handle case when neither previous nor next activity exists', () => {
      const activity = createActivity({
        start: createDate('2025-04-17T10:00:00Z'),
        end: undefined,
      });

      const targetDate = createDate('2025-04-17T11:00:00Z');

      const result = activity.tryGetClosestValidStart(targetDate);

      expect(result).toEqual(targetDate);
    });
    it('should handle case when there is no end time on the activity', () => {
      const activity = createActivity({
        start: createDate('2025-04-17T10:00:00Z'),
        end: undefined,
      });

      const targetDate = createDate('2025-04-17T11:00:00Z');

      const result = activity.tryGetClosestValidStart(targetDate);

      expect(result).toEqual(targetDate);
    });

    //edge cases
    it('should return undefined if current activity starts one millisecond before previous activity end and next activity starts one millisecond after current activity start', () => {
      const previousActivity = createActivity({
        start: createDate('2025-04-17T10:00:00Z'),
        end: createDate('2025-04-17T10:00:01Z'),
      });

      const activity = createActivity({
        start: createDate('2025-04-17T10:00:02Z'),
        end: createDate('2025-04-17T12:00:00Z'),
      });

      const nextActivity = createActivity({
        start: createDate('2025-04-17T10:00:03Z'),
      });

      linkActivities(previousActivity, activity);
      linkActivities(activity, nextActivity);

      const targetDate = createDate('2025-04-17T10:00:02Z');

      const result = activity.tryGetClosestValidStart(targetDate);

      expect(result).toBeUndefined();
    });

    it('should handle case when an activity start time is a year and a day before end and then it is changed to 1 hour after original end', () => {
      const activity = createActivity({
        start: createDate('2025-04-17T10:00:00Z'),
        end: createDate('2026-04-17T10:00:00Z'),
      });

      const targetDate = createDate('2025-04-17T11:00:00Z');

      const result = activity.tryGetClosestValidStart(targetDate);

      expect(result).toEqual(targetDate);
    });

    it('should handle case when an activity start time is a year and a day before end and then it is changed to 1 hour before original start', () => {
      const activity = createActivity({
        start: createDate('2025-04-17T10:00:00Z'),
        end: createDate('2026-04-17T10:00:00Z'),
      });

      const targetDate = createDate('2025-04-17T09:00:00Z');

      const result = activity.tryGetClosestValidStart(targetDate);

      expect(result).toEqual(targetDate);
    });
  });

  describe('tryGetClosestValidEnd', () => {
    it('should return undefined if the activity is in progress', () => {
      const activity = createActivity({
        start: createDate('2025-04-17T10:00:00Z'),
        end: undefined,
      });

      const targetDate = createDate('2025-04-17T12:00:00Z');

      const result = activity.tryGetClosestValidEnd(targetDate);

      expect(result).toBeUndefined();
    });

    it('should return undefined if target date equals existing end', () => {
      const activity = createActivity({
        start: createDate('2025-04-17T10:00:00Z'),
        end: createDate('2025-04-17T12:00:00Z'),
      });
      const sameAsActivityEnd = createDate('2025-04-17T12:00:00Z');

      const result = activity.tryGetClosestValidEnd(sameAsActivityEnd);

      expect(result).toBeUndefined();
    });
    it('should adjust end time if it falls before activity start', () => {
      const activity = createActivity({
        start: createDate('2025-04-17T10:00:00Z'),
        end: createDate('2025-04-17T12:00:00Z'),
      });
      const beforeActivityStart = createDate('2025-04-17T09:00:00Z');

      const result = activity.tryGetClosestValidEnd(beforeActivityStart);

      // Should be start + 1 millisecond
      const expected = new Date(activity.start);
      expected.setTime(expected.getTime() + 1);

      expect(result).toEqual(expected);
    });

    it('should adjust end time if it falls after next activity start', () => {
      const activity = createActivity({
        start: createDate('2025-04-17T10:00:00Z'),
        end: createDate('2025-04-17T12:00:00Z'),
      });

      const nextActivity = createActivity({
        start: createDate('2025-04-17T13:00:00Z'),
      });

      linkActivities(activity, nextActivity);

      const afterNextActivityStart = createDate('2025-04-17T14:00:00Z');

      const result = activity.tryGetClosestValidEnd(afterNextActivityStart);

      expect(result).toEqual(nextActivity.start);
    });
    it('should return the target date if it falls within valid range', () => {
      const activity = createActivity({
        start: createDate('2025-04-17T10:00:00Z'),
        end: createDate('2025-04-17T12:00:00Z'),
      });

      const nextActivity = createActivity({
        start: createDate('2025-04-17T14:00:00Z'),
      });

      linkActivities(activity, nextActivity);

      const withinValidRange = createDate('2025-04-17T13:00:00Z');

      const result = activity.tryGetClosestValidEnd(withinValidRange);

      expect(result).toEqual(withinValidRange);
    });

    // edge cases
    it('should return undefined if current activity ends one millisecond after start and next activity starts one millisecond after current activity end', () => {
      const activity = createActivity({
        start: createDate('2025-04-17T10:00:00Z'),
        end: createDate('2025-04-17T10:00:01Z'),
      });

      const nextActivity = createActivity({
        start: createDate('2025-04-17T10:00:02Z'),
      });

      linkActivities(activity, nextActivity);

      const targetDate = createDate('2025-04-17T10:00:01Z');

      const result = activity.tryGetClosestValidEnd(targetDate);

      expect(result).toBeUndefined();
    });

    it('should handle case when an activity end time is a year and a day after start and then it is changed to 1 hour after original start', () => {
      const activity = createActivity({
        start: createDate('2025-04-17T10:00:00Z'),
        end: createDate('2026-04-17T10:00:00Z'),
      });

      const targetDate = createDate('2025-04-17T11:00:00Z');

      const result = activity.tryGetClosestValidEnd(targetDate);

      expect(result).toEqual(targetDate);
    });

    it('should handle case when an activity end time is a year and a day after start and then it is changed to 1 hour before original start', () => {
      const activity = createActivity({
        start: createDate('2025-04-17T10:00:00Z'),
        end: createDate('2026-04-17T10:00:00Z'),
      });

      const targetDate = createDate('2025-04-17T09:00:00Z');

      const result = activity.tryGetClosestValidEnd(targetDate);
      const expectedResult = new Date(activity.start);
      expectedResult.setTime(expectedResult.getTime() + 1);

      expect(result).toEqual(expectedResult);
    });
  });
});
