export interface SchedulerConstructorParams {
  enabled: boolean;
  interval: number;
}

export type SchedulerOperation = (b: unknown[]) => Promise<void> | void;

export type SchedulerState = Partial<SchedulerConstructorParams>;
