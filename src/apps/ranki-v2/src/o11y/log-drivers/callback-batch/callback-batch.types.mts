import type { LogProcessorConstructorParams } from "../utils/log-processor/log-processor.types.mjs";
import type { SchedulerConstructorParams } from "../utils/scheduler/scheduler.types.mjs";

export type CallbackBatchRawLogEntry = any;

export interface CallbackBatchLogDriverConstructorParams {
  processor: Omit<LogProcessorConstructorParams, "callback">;
  scheduler: SchedulerConstructorParams;
}

export type CallbackBatchLogDriverCallbackFunc = (v: any[]) => void;
