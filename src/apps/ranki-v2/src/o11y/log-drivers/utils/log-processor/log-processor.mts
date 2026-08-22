import type { LogValue } from "_/o11y/log/ranki-logging.types.mjs";
import type {
  LogProcessorConfigureProps,
  LogProcessorConstructorParams,
  LogProcessorStaticConfig,
  NewLogValueCallback,
} from "./log-processor.types.mjs";
import { assertNever, assertNotUndefined } from "_error/assertions.mjs";

export class LogProcessor {
  private readonly name: string;
  private sanitizerName: string = "none";
  private formatterName: string = "none";
  private stringifierName: string = "none";
  private static config: LogProcessorStaticConfig = {
    sanitizers: { none: (v) => v },
    formatters: { none: (v) => v },
    stringifiers: { none: (v) => v },
  };
  private readonly callback: NewLogValueCallback;

  public static configure(conf: LogProcessorConfigureProps) {
    this.config.sanitizers = { ...this.config.sanitizers, ...conf.sanitizers };
    this.config.formatters = { ...this.config.formatters, ...conf.formatters };
    this.config.stringifiers = {
      ...this.config.stringifiers,
      ...conf.stringifiers,
    };
  }

  constructor(params: LogProcessorConstructorParams) {
    this.name = params.name;
    this.callback = params.callback;
    switch (typeof params.sanitizer) {
      case "function":
        {
          const name = `${this.name}-provided`;
          this.sanitizerName = name;
          LogProcessor.config.sanitizers = {
            ...LogProcessor.config.sanitizers,
            [name]: params.sanitizer,
          };
        }
        break;
      case "string":
        this.sanitizerName = params.sanitizer;
        break;
      case "undefined":
        break;
      default:
        assertNever({
          why: "Unrecognized sanitizer type",
          details: { params },
        });
    }
    switch (typeof params.formatter) {
      case "function":
        {
          const name = `${this.name}-provided`;
          this.formatterName = name;
          LogProcessor.config.formatters = {
            ...LogProcessor.config.formatters,
            [name]: params.formatter,
          };
        }
        break;
      case "string":
        this.formatterName = params.formatter;
        break;
      case "undefined":
        break;
      default:
        assertNever({
          why: "Unrecognized formatter type",
          details: { params },
        });
    }
    switch (typeof params.stringifier) {
      case "function":
        {
          const name = `${this.name}-provided`;
          this.stringifierName = name;
          LogProcessor.config.stringifiers = {
            ...LogProcessor.config.stringifiers,
            [name]: params.stringifier,
          };
        }
        break;
      case "string":
        this.stringifierName = params.stringifier;
        break;
      case "undefined":
        break;
      default:
        assertNever({
          why: "Unrecognized stringifier type",
          details: { params },
        });
    }
  }

  private getSanitizer() {
    const sanitizer = LogProcessor.config.sanitizers[this.sanitizerName];
    assertNotUndefined(sanitizer, {
      details: {
        printerName: this.sanitizerName,
        printers: LogProcessor.config.sanitizers,
      },
      why: "undefined sanitizer",
    });
    return sanitizer;
  }

  private getFormatter() {
    const formatter = LogProcessor.config.formatters[this.formatterName];
    assertNotUndefined(formatter, {
      details: {
        printerName: this.formatterName,
        printers: LogProcessor.config.formatters,
      },
      why: "undefined formatter",
    });
    return formatter;
  }

  private getStringifier() {
    const stringifier = LogProcessor.config.stringifiers[this.stringifierName];
    assertNotUndefined(stringifier, {
      details: {
        printerName: this.stringifierName,
        printers: LogProcessor.config.stringifiers,
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
