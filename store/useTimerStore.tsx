import { create } from 'zustand';
import { combine } from 'zustand/middleware';

type TimerState = {
  startTime: Date | undefined;
  endTime: Date | undefined;
};

type TimerActions = {
  startTimer: (customStart?: Date) => Date | undefined;
  endTimer: () => Date | undefined;
  resetTimer: () => void;
  getDuration: () => number;
};

export const useTimerStore = create(
  combine<TimerState, TimerActions>(
    {
      startTime: undefined as Date | undefined,
      endTime: undefined as Date | undefined,
    },
    (set, get) => {
      return {
        startTimer: (customStart?: Date) => {
          if (get().startTime !== undefined) {
            return undefined;
          }

          const now = customStart || new Date();
          set({ startTime: now });
          return now;
        },

        endTimer: () => {
          const { startTime, endTime } = get();
          if (!(startTime && endTime === undefined)) {
            return undefined;
          }
          const now = new Date();
          set({ endTime: now });
          return now;
        },

        resetTimer: () => {
          set({
            startTime: undefined,
            endTime: undefined,
          });
        },
        getDuration: () => {
          const { startTime, endTime } = get();
          if (!startTime) {
            return 0;
          }

          return (endTime ?? new Date()).getTime() - startTime.getTime();
        },
      };
    }
  )
);
