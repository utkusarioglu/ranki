import { RankiLogging } from "./log/log.mjs";
import { type RankiLogRuntimeProps } from "./log/log.types.mjs";
import { RankiTracing } from "./trace/trace.mjs";
import { type RankiTracingRuntimeProps } from "./trace/trace.types.mjs";
import { RankiMetrics } from "./meter/meter.mjs";
import { type RankiMetricsRuntimeProps } from "./meter/meter.types.mjs";
import { sanitizedYamlPrinter } from "./log/log-drivers/console-batch/yaml-printer.mjs";

RankiTracing.configure();

RankiLogging.configure({
  consoleBatch: {
    printers: {
      sanitizedYamlPrinter,
    },
  },
});

RankiMetrics.configure();

interface RankiO11yRuntimeProps {
  log: RankiLogRuntimeProps;
  trace: RankiTracingRuntimeProps;
  meter: RankiMetricsRuntimeProps;
}

export class RankiO11y {
  public static readonly log = RankiLogging;
  public static readonly trace = RankiTracing;
  public static readonly meter = RankiMetrics;

  public static enable(props: RankiO11yRuntimeProps) {
    this.log.enable(props.log);
    this.trace.enable(props.trace);
    this.meter.enable(props.meter);
  }
}

// remember to turn off geometry observability if you turn this off. the logistics of getting state over there hasn't been implemented
RankiO11y.enable({
  log: {
    drivers: {
      consoleBatch: {
        printer: "sanitizedYamlPrinter",
      },
      loki: {
        endpoint: "/loki/api/v1/push",
        scheduler: {
          enabled: true,
          interval: 5000,
        },
      },
    },
  },
  trace: {
    endpoint: "http://localhost:4318/v1/traces",
  },
  meter: {
    endpoint: "/api/v1/otlp/v1/metrics",
  },
});
