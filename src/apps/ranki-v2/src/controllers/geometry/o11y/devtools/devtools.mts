import type {
  DevtoolsLogDriver,
  DevtoolsPause,
  O11yDevtoolsLogAttributes,
  O11yDevtoolsStaticConfig,
} from "./devtools.types.mjs";

declare global {
  var o11yDevtools: DevtoolsLogDriver;
}

export class O11yDevtools {
  public static DEVTOOLS_DELAY = 0;

  public static configure(conf: O11yDevtoolsStaticConfig) {
    if (conf.sequencer?.stutter) {
      O11yDevtools.DEVTOOLS_DELAY = conf.sequencer.stutter;
    }
  }

  public static log(log: string, attributes: O11yDevtoolsLogAttributes) {
    const d = globalThis.o11yDevtools;
    if (!d) {
      return;
    }
    d.log({ attributes, log });
  }

  public static async pause(props?: DevtoolsPause) {
    const duration = props?.duration || this.DEVTOOLS_DELAY;
    if (duration === 0) return Promise.resolve();

    const details = props?.props || {};
    this.log("Devtools.pause", details);
    await new Promise<void>((r) =>
      setTimeout(() => {
        r();
      }, duration),
    );
  }
}
