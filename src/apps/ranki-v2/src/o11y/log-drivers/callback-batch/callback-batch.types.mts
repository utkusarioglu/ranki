import type { LogProcessorConstructorParams } from "../utils/log-processor/log-processor.types.mjs";
import type { SchedulerConstructorParams } from "../utils/scheduler/scheduler.types.mjs";

export type CallbackBatchLogDriverCallbackFunc = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  v: any[],
) => void;

export interface CallbackBatchLogDriverConstructorParams {
  processor: Omit<LogProcessorConstructorParams, "callback">;
  scheduler: SchedulerConstructorParams;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type CallbackBatchRawLogEntry = { type?: "RawLogEntry" } & any;
