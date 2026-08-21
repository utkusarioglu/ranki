import type { DebugPause, O11yDebuggerStaticConfig } from "./debug.types.mjs";

export class O11yDebugger {
  public static DEBUG_DELAY = 0;

  public static configure(conf: O11yDebuggerStaticConfig) {
    if (conf.sequencer?.stutter) {
      O11yDebugger.DEBUG_DELAY = conf.sequencer.stutter;
    }
  }

  public static log(log: string, attributes: Record<string, unknown>) {
    console.log(log, attributes);
  }

  public static async pause(props?: DebugPause) {
    const duration = props?.duration || this.DEBUG_DELAY;
    if (duration === 0) return Promise.resolve();

    const details = props?.props || {};
    this.log("Debug.pause", details);
    await new Promise<void>((r) =>
      setTimeout(() => {
        r();
      }, duration),
    );
  }
}
