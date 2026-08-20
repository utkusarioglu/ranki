import { sanitizedYamlPrinter } from "./log/log-drivers/console-batch/yaml-printer.mjs";
import { RankiLogging } from "./log/log.mjs";
import { type RankiLogRuntimeProps } from "./log/log.types.mjs";
import { RankiMetrics } from "./meter/meter.mjs";
import { type RankiMetricsRuntimeProps } from "./meter/meter.types.mjs";
import { RankiTracing } from "./trace/trace.mjs";
import { type RankiTracingRuntimeProps } from "./trace/trace.types.mjs";

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
  meter: RankiMetricsRuntimeProps;
  trace: RankiTracingRuntimeProps;
}

export class RankiO11y {
  public static readonly log = RankiLogging;
  public static readonly meter = RankiMetrics;
  public static readonly trace = RankiTracing;

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
        endpoint: "http://localhost:8080/loki/loki/api/v1/push",
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
