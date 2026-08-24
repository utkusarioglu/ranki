import { RankiDebugging } from "./debug/ranki-debugging.mjs";
import { basicRepresentation } from "./sanitizers/sorted-stringified.mjs";
import { RankiLogging } from "./log/ranki-logging.mjs";
import { RankiMetering } from "./meter/ranki-metering.mjs";
import type {
  RankiO11yRuntimeProps,
  RankiO11yStaticConfiguration,
} from "./o11y.types.mjs";
import { RankiTracing } from "./trace/ranki-tracing.mjs";
import { RankiDevMethods } from "_/dev/dev-methods.mjs";
import yaml from "yaml";
import { LogProcessor } from "./log-drivers/utils/log-processor/log-processor.mjs";
import { objectSorter } from "./formatters/object-sorter.mjs";
import { LogPrinter } from "./log-drivers/utils/log-printer/log-printer.mjs";
import { consoleLogRow, yamlRow } from "./printers/printers.mjs";
import { ConsoleBatchLogDriver } from "./log-drivers/console-batch/console-batch.mjs";
import { FileBatchLogDriver } from "./log-drivers/file-batch/file-batch.mjs";
import { LokiLogDriver } from "./log-drivers/loki/loki.mjs";

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

  public static configure(r: RankiO11yStaticConfiguration) {
    RankiDebugging.configure(r.debug);
    RankiLogging.configure(r.log);
    LogProcessor.configure(r.processors);
    LogPrinter.configure(r.printers);
  }
}

RankiO11y.configure({
  debug: {
    drivers: {
      consoleBatch: ConsoleBatchLogDriver,
      fileBatch: FileBatchLogDriver,
    },
  },
  log: {
    drivers: {
      consoleBatch: ConsoleBatchLogDriver,
      fileBatch: FileBatchLogDriver,
      loki: LokiLogDriver,
    },
  },
  processors: {
    sanitizers: {
      basicRepresentation,
    },
    formatters: {
      objectSorter,
    },
    stringifiers: {
      jsonOneLine: (v) => JSON.stringify(v),
      jsonMultiLine: (v) => JSON.stringify(v, null, 2),
      yaml: (v) => yaml.stringify(v),
    },
  },
  printers: {
    yamlRow,
    consoleLogRow,
  },
});

// remember to turn off geometry observability if you turn this off. the logistics of getting state over there hasn't been implemented
RankiO11y.enable({
  debug: {
    drivers: {
      consoleBatch: {
        printer: "consoleLogRow",
        formatter: "objectSorter",
        sanitizer: "none",
      },
      fileBatch: {
        filePath: "debugger.log",
        stringifier: "jsonOneLine",
        sanitizer: "basicRepresentation",
        scheduler: {
          enabled: true,
          interval: 5000,
        },
      },
    },
  },
  log: {
    drivers: {
      consoleBatch: {
        printer: "yamlRow",
        formatter: "objectSorter",
      },
      // fileBatch: {
      //   filePath: "log.log",
      //   stringifier: "jsonOneLine",
      //   sanitizer: "basicRepresentation",
      //   scheduler: {
      //     enabled: true,
      //     interval: 5000,
      //   },
      // },
      loki: {
        endpoint: "http://localhost:8080/loki/loki/api/v1/push",
        sanitizer: "basicRepresentation",
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
