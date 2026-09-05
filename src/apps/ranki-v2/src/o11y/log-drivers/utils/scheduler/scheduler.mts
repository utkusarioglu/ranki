import type {
  SchedulerConstructorParams,
  SchedulerOperation,
  SchedulerState,
} from "./scheduler.types.mjs";

import { DEFAULT_SEND_INTERVAL } from "../../loki/loki.constants.mjs";

export class Scheduler<T> {
  private enabled: boolean = false;
  private interval = DEFAULT_SEND_INTERVAL;
  private operation: SchedulerOperation;
  private queue: T[] = [];
  private sendOp: NodeJS.Timeout | undefined;

  constructor(
    operation: SchedulerOperation,
    params?: SchedulerConstructorParams,
  ) {
    this.operation = operation;
    if (params) this.setState(params);
  }

  enqueue(item: T) {
    this.queue.push(item);
  }

  setState(params: SchedulerState) {
    if (params.interval) this.interval = params.interval;
    this.enabled = params.enabled ? params.enabled : false;

    if (this.enabled) {
      this.start();
    } else {
      this.stop();
    }
  }

  private start() {
    if (this.sendOp) return;
    this.sendOp = setInterval(() => this.task(), this.interval);
  }

  private stop() {
    if (!this.sendOp) return;
    clearInterval(this.sendOp);
  }

  private async task() {
    const curr = [...this.queue];
    this.queue = [];
    try {
      if (!curr.length) return;
      await this.operation(curr);
    } catch {
      // console.log("failed operation. length: ", curr.length, e, curr);
      this.queue = [...curr, ...this.queue];
    }
  }
}
