import { PROPAGATE_DELAY } from "_/debug/debug.constants.mjs";

type RafCallback = () => void;

export class TimingUtils {
  /**
   * Waits for layout to be available. as a heuristic, 2 frames work reliably.
   * This doesn't mean it cannot break.
   */
  static async waitLayout() {
    await TimingUtils.raf(2);
  }

  static async delay(msec: number) {
    if (msec === 0) return Promise.resolve();
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        resolve();
      }, msec);
    });
  }

  private static async propagateDelay(callback: Function = () => {}) {
    if (PROPAGATE_DELAY === 0) {
      return Promise.resolve();
    }
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        callback();
        resolve();
      }, PROPAGATE_DELAY);
    });
  }

  static async raf(frames: number = 2, cb?: RafCallback): Promise<void> {
    function step(resolve: () => void, cb?: RafCallback) {
      if (--frames <= 0) {
        cb && cb();
        resolve();
      } else {
        requestAnimationFrame(() => step(resolve, cb));
      }
    }
    // await this.propagateDelay();
    return new Promise<void>((r) => step(r, cb));
  }
}
