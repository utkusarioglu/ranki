import type { LogDriver, LogValue } from "_/o11y/log/ranki-logging.types.mjs";
import type {
  CallbackLogDriverConfigureProps,
  CallbackLogDriverConstructorParams,
  CallbackLogDriverStaticConfig,
  NewLogValueCallback,
} from "./callback.types.mjs";
import { assertNotUndefined } from "_error/assertions.mjs";

export class CallbackLogDriver implements LogDriver {
  private sanitizerName: string = "none";
  private formatterName: string = "none";
  private stringifierName: string = "none";
  private static config: CallbackLogDriverStaticConfig = {
    sanitizers: { none: (v) => v },
    formatters: { none: (v) => v },
    stringifiers: { none: (v) => v },
  };
  private readonly callback: NewLogValueCallback;

  public static configure(conf: CallbackLogDriverConfigureProps) {
    this.config.sanitizers = { ...this.config.sanitizers, ...conf.sanitizers };
    this.config.formatters = { ...this.config.formatters, ...conf.formatters };
    this.config.stringifiers = {
      ...this.config.stringifiers,
      ...conf.stringifiers,
    };
  }

  constructor(params: CallbackLogDriverConstructorParams) {
    this.callback = params.callback;
    if (params?.sanitizer) this.sanitizerName = params.sanitizer;
    if (params?.formatter) this.formatterName = params.formatter;
    if (params?.stringifier) this.stringifierName = params.stringifier;
  }

  private getSanitizer() {
    const sanitizer = CallbackLogDriver.config.sanitizers[this.sanitizerName];
    assertNotUndefined(sanitizer, {
      details: {
        printerName: this.sanitizerName,
        printers: CallbackLogDriver.config.sanitizers,
      },
      why: "undefined sanitizer",
    });
    return sanitizer;
  }

  private getFormatter() {
    const formatter = CallbackLogDriver.config.formatters[this.formatterName];
    assertNotUndefined(formatter, {
      details: {
        printerName: this.formatterName,
        printers: CallbackLogDriver.config.formatters,
      },
      why: "undefined formatter",
    });
    return formatter;
  }

  private getStringifier() {
    console.log("ss", this.stringifierName);
    const stringifier =
      CallbackLogDriver.config.stringifiers[this.stringifierName];
    assertNotUndefined(stringifier, {
      details: {
        printerName: this.stringifierName,
        printers: CallbackLogDriver.config.stringifiers,
      },
      why: "undefined stringifier",
    });
    return stringifier;
  }

  log(v: LogValue) {
    const sanitizer = this.getSanitizer();
    const sanitized = sanitizer(v as LogValue[]);
    const formatter = this.getFormatter();
    const formatted = formatter(sanitized);
    const stringifier = this.getStringifier();
    const stringified = stringifier(formatted);

    this.callback(stringified);
  }
}
