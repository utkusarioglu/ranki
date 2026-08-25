import type {
  DebugLogDriver,
  DebugPause,
  O11yDebuggerStaticConfig,
  O11yDebugLogAttributes,
} from "./debug.types.mjs";

declare global {
  var o11yDebugger: DebugLogDriver;
}

export class O11yDebugger {
  public static DEBUG_DELAY = 0;

  public static configure(conf: O11yDebuggerStaticConfig) {
    if (conf.sequencer?.stutter) {
      O11yDebugger.DEBUG_DELAY = conf.sequencer.stutter;
    }
  }

  public static log(log: string, attributes: O11yDebugLogAttributes) {
    const d = globalThis.o11yDebugger;
    if (!d) {
      return;
    }
    d.log({ attributes, log });
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
