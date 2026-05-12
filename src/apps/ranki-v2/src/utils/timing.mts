export class TimingUtils {
  /**
   * Waits for layout to be available. as a heuristic, 2 frames work reliably.
   * This doesn't mean it cannot break.
   */
  static async waitLayout() {
    await TimingUtils.raf(2, () => {});
  }

  static raf(frames: number = 2, cb: () => void): Promise<void> {
    function step(resolve: () => void, cb: () => void) {
      if (--frames <= 0) {
        cb();
        resolve();
      } else {
        requestAnimationFrame(() => step(resolve, cb));
      }
    }
    return new Promise<void>((r) => step(r, cb));
  }
}
