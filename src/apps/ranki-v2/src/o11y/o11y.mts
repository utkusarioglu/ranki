import { sanitizedYamlPrinter } from "./log/log-drivers/console-batch/yaml-printer.mjs";
import { RankiLogging } from "./log/ranki-logging.mjs";
import { type RankiLogRuntimeProps } from "./log/ranki-logging.types.mjs";
import { RankiMetering } from "./meter/ranki-metering.mjs";
import { type RankiMeteringRuntimeProps } from "./meter/ranki-metering.types.mjs";
import { RankiTracing } from "./trace/ranki-tracing.mjs";
import { type RankiTracingRuntimeProps } from "./trace/ranki-tracing.types.mjs";

RankiTracing.configure();

RankiLogging.configure({
  consoleBatch: {
    printers: {
      sanitizedYamlPrinter,
    },
  },
});

RankiMetering.configure();

interface RankiO11yRuntimeProps {
  log: RankiLogRuntimeProps;
  meter: RankiMeteringRuntimeProps;
  trace: RankiTracingRuntimeProps;
}

export class RankiO11y {
  public static readonly log = RankiLogging;
  public static readonly meter = RankiMetering;
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
