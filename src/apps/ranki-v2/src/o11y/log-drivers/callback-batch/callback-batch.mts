import type { LogDriver } from "_/o11y/log/ranki-logging.types.mjs";

import type { SchedulerState } from "../utils/scheduler/scheduler.types.mjs";
import type {
  CallbackBatchLogDriverCallbackFunc,
  CallbackBatchLogDriverConstructorParams,
  CallbackBatchRawLogEntry,
} from "./callback-batch.types.mjs";

import { LogProcessor } from "../utils/log-processor/log-processor.mjs";
import { Scheduler } from "../utils/scheduler/scheduler.mjs";

export class CallbackBatchLogDriver implements LogDriver {
  private callback: CallbackBatchLogDriverCallbackFunc;
  private readonly pipe: LogProcessor;
  private readonly scheduler: Scheduler<CallbackBatchRawLogEntry>;

  constructor(
    callback: CallbackBatchLogDriverCallbackFunc,
    params: CallbackBatchLogDriverConstructorParams,
  ) {
    this.callback = callback;
    this.pipe = new LogProcessor({
      ...params.processor,
      callback: (v) => this.scheduler.enqueue(v),
    });
    this.scheduler = new Scheduler((v) => this.callback(v), params.scheduler);
  }

  log(value: CallbackBatchRawLogEntry): void {
    this.pipe.log(value);
  }

  setSchedulerState(s: SchedulerState) {
    this.scheduler.setState(s);
  }
}
