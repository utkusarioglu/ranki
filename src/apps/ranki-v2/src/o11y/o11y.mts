import { RankiLogging, type RankiLogRuntimeProps } from "./log.mjs";
import { RankiTracing, type RankiTracingRuntimeProps } from "./trace.mjs";
import { RankiMetrics, type RankiMetricsRuntimeProps } from "./meter.mjs";
import { sanitizedYamlPrinter } from "./log-drivers/console-batch/yaml-printer.mjs";

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
