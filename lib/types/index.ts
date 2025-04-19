export type DisplayedCategory = {
  value: string;
  label: string;
};

export type CreateActivityParams = {
  startTime: Date;
  endTime: Date;
  category: string;
};
