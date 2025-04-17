import { Datetime } from '../datetime';

describe('Datetime', () => {
  it('should create a new Datetime instance', () => {
    const date = new Date('2025-04-17T10:00:00Z');
    const datetime = new Datetime(date);
    expect(datetime).toBeInstanceOf(Datetime);
  });

  it('should return the value', () => {
    const date = new Date('2025-04-17T10:00:00Z');
    const datetime = new Datetime(date);
    expect(datetime.value).toEqual(date);
  });
});
