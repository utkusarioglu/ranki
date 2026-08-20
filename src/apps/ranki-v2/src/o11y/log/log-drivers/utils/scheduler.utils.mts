import { DEFAULT_SEND_INTERVAL } from "../loki/loki.constants.mjs";

export class Scheduler<T> {
  private interval = DEFAULT_SEND_INTERVAL;
  private operation: (b: T[]) => Promise<void>;
  private queue: T[] = [];
  private sendOp: NodeJS.Timeout | undefined;

  constructor(operation: (b: T[]) => Promise<void>, interval?: number) {
    this.operation = operation;
    if (interval) this.interval = interval;
  }

  enqueue(item: T) {
    this.queue.push(item);
  }

  start() {
    if (this.sendOp) return;
    this.sendOp = setInterval(() => this.task(), this.interval);
  }

  stop() {
    if (!this.sendOp) return;
    clearInterval(this.sendOp);
  }

  private async task() {
    const curr = [...this.queue];
    this.queue = [];
    try {
      await this.operation(curr);
    } catch (e) {
      console.log("failed operation. length: ", curr.length, e);
      this.queue = [...curr, ...this.queue];
    }
  }
}
