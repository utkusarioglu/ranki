import {
  RankiDebugging,
  type RankiDebuggingRuntimeProps,
} from "./debug/ranki-debugging.mjs";
import { ConsoleBatchLogDriver } from "./log/log-drivers/console-batch/console-batch.mjs";
import {
  consoleLogRow,
  yamlRow,
} from "./log/log-drivers/console-batch/yaml-printer.mjs";
import { sortedStringified } from "./log/log-drivers/utils/sanitize.utils.mjs";
import { RankiLogging } from "./log/ranki-logging.mjs";
import { type RankiLogRuntimeProps } from "./log/ranki-logging.types.mjs";
import { RankiMetering } from "./meter/ranki-metering.mjs";
import { type RankiMeteringRuntimeProps } from "./meter/ranki-metering.types.mjs";
import { RankiTracing } from "./trace/ranki-tracing.mjs";
import { type RankiTracingRuntimeProps } from "./trace/ranki-tracing.types.mjs";

ConsoleBatchLogDriver.configure({
  printers: {
    yamlRow,
    consoleLogRow,
  },
  sanitizers: {
    sortedStringified,
  },
});

interface RankiO11yRuntimeProps {
  log: RankiLogRuntimeProps;
  meter: RankiMeteringRuntimeProps;
  trace: RankiTracingRuntimeProps;
  debug: RankiDebuggingRuntimeProps;
}

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
  }

  public static getConsoleAccess() {
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
      consoleBatch: {
        printer: "consoleLogRow",
        sanitizer: "none",
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
