type RafCallback = () => void;

export class TimingUtils {
  static async delay(msec: number) {
    if (msec === 0) return Promise.resolve();
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        resolve();
      }, msec);
    });
  }

  static async raf(frames: number = 1, cb?: RafCallback): Promise<void> {
    function step(resolve: () => void, cb?: RafCallback) {
      if (--frames <= 0) {
        if (cb) cb();
        resolve();
      } else {
        requestAnimationFrame(() => step(resolve, cb));
      }
    }
    // await this.propagateDelay();
    return new Promise<void>((r) => step(r, cb));
  }
}
