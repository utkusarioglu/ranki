import type { DebugPause } from "./debug.types.mjs";

import { O11yLogger } from "../logger/logger.mjs";

export class O11yDebugger {
  public static DEBUG_DELAY = 0;

  public static async pause(props?: DebugPause) {
    const duration = props?.duration || this.DEBUG_DELAY;
    if (duration === 0) return Promise.resolve();

    const details = props?.props || {};
    O11yLogger.debug("Debug.pause", details);
    await new Promise<void>((r) =>
      setTimeout(() => {
        r();
      }, duration),
    );
  }
}
