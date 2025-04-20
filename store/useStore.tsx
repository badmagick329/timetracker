import { useActivities } from '@/hooks/useActivities';
import { Activity } from '@/lib/core/activity';
import { Category } from '@/lib/core/category';
import { DateOnly } from '@/lib/core/date-only';
import { CreateActivityParams } from '@/lib/types';
import { createContext, useContext, useState } from 'react';

type StoreContextType = {
  timerState: {
    startTime: Date | undefined;
    endTime: Date | undefined;
    setStartTime: (startTime: Date | undefined) => void;
    setEndTime: (endTime: Date | undefined) => void;
  };
  createActivity: ({
    startTime,
    endTime,
    category,
  }: CreateActivityParams) => Promise<Activity | null>;
  getActivities: (filters?: {
    date?: DateOnly;
    category?: Category;
  }) => Promise<Activity[] | null>;
};

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider = ({ children }: { children: React.ReactNode }) => {
  const [startTime, setStartTime] = useState<Date | undefined>(undefined);
  const [endTime, setEndTime] = useState<Date | undefined>(undefined);
  const { createActivity, getActivities } = useActivities();

  return (
    <StoreContext.Provider
      value={{
        createActivity,
        getActivities,
        timerState: {
          startTime,
          endTime,
          setStartTime,
          setEndTime,
        },
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = (): StoreContextType => {
  const context = useContext(StoreContext);
  if (context === undefined) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
