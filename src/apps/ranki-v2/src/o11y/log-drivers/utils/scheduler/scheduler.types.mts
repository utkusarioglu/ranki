export type SchedulerOperation = (b: unknown[]) => Promise<void> | void;

export interface SchedulerConstructorParams {
  interval: number;
  enabled: boolean;
}

export type SchedulerState = Partial<SchedulerConstructorParams>;
