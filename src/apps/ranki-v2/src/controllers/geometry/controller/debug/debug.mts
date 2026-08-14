import type { DebugPause } from "./debug.types.mjs";

import { Logger } from "../logger/logger.mjs";

export class Debug {
  public static DEBUG_DELAY = 1000;

  public static async pause(props?: DebugPause) {
    const duration = props?.duration || this.DEBUG_DELAY;
    if (duration === 0) return Promise.resolve();

    const details = props?.props || {};
    Logger.debug("Debug.pause", details);
    await new Promise<void>((r) =>
      setTimeout(() => {
        r();
      }, duration),
    );
  }
}
