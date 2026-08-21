import { RankiDebugging } from "./debug/ranki-debugging.mjs";
import { ConsoleBatchLogDriver } from "./log-drivers/console-batch/console-batch.mjs";
import { consoleLogRow, yamlRow } from "./printers/printers.mjs";
import { sortedStringified } from "./sanitizers/sorted-stringified.mjs";
import { RankiLogging } from "./log/ranki-logging.mjs";
import { RankiMetering } from "./meter/ranki-metering.mjs";
import type { RankiO11yRuntimeProps } from "./o11y.types.mjs";
import { RankiTracing } from "./trace/ranki-tracing.mjs";
import { FileBatchLogDriver } from "./log-drivers/file-batch/file-batch.mjs";
import { RankiDevMethods } from "_/dev/dev-methods.mjs";
import { HtmlLogDriver } from "./log-drivers/html/html.mjs";

ConsoleBatchLogDriver.configure({
  printers: {
    yamlRow,
    consoleLogRow,
  },
  sanitizers: {
    sortedStringified,
  },
});

FileBatchLogDriver.configure({
  sanitizers: {
    sortedStringified,
  },
});

HtmlLogDriver.configure({
  sanitizers: {
    sortedStringified,
  },
});

export class RankiO11y {
  public static readonly log = RankiLogging;
  public static readonly meter = RankiMetering;
  public static readonly trace = RankiTracing;
  public static readonly debug = RankiDebugging;

  public static enable(props: RankiO11yRuntimeProps) {
    this.debug.enable(props.debug);
    this.log.enable(props.log);
    this.trace.enable(props.trace);
    this.meter.enable(props.meter);

    RankiDevMethods.setO11yConsoleAccess(this.getConsoleAccess());
  }

  private static getConsoleAccess() {
    return {
      log: this.log.getConsoleAccess(),
      debug: this.debug.getConsoleAccess(),
    };
  }
}

// remember to turn off geometry observability if you turn this off. the logistics of getting state over there hasn't been implemented
RankiO11y.enable({
  debug: {
    drivers: {
      html: {
        sanitizer: "sortedStringified",
      },
      consoleBatch: {
        printer: "consoleLogRow",
        sanitizer: "none",
      },
      fileBatch: {
        filePath: "debugger.log",
        sanitizer: "sortedStringified",
        scheduler: {
          enabled: false,
          interval: 5000,
        },
      },
    },
  },
  log: {
    drivers: {
      consoleBatch: {
        printer: "yamlRow",
        sanitizer: "sortedStringified",
      },
      loki: {
        endpoint: "http://localhost:8080/loki/loki/api/v1/push",
        sanitizer: "sortedStringified",
        scheduler: {
          enabled: true,
          interval: 5000,
        },
      },
    },
  },
  meter: {
    endpoint: "http://localhost:8080/prometheus/api/v1/otlp/v1/metrics",
  },
  trace: {
    endpoint: "http://localhost:8080/tempo/v1/traces",
  },
});
