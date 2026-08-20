import { RankiLogging } from "./log.mjs";
import { RankiTracing } from "./trace.mjs";
import { RankiMetrics } from "./meter.mjs";
import { sanitizedYamlPrinter } from "./log-drivers/console-batch/yaml-printer.mjs";

RankiTracing.configure({ url: "http://localhost:4318/v1/traces" });
RankiLogging.configure({
  // loki: {
  //   loki: {
  //     endpoint: "/loki/api/v1/push",
  //   },
  //   scheduler: {
  //     enabled: true,
  //     interval: 5000,
  //   },
  // },
  consoleBatch: {
    printers: {
      sanitizedYamlPrinter,
    },
    // printer: "sanitizedYamlPrinter",
  },
});

RankiMetrics.configure({
  url: "/api/v1/otlp/v1/metrics",
});

export class RankiO11y {
  // when this can be fed from state
  // configure()

  public static initialize() {
    RankiLogging.initialize();
    RankiTracing.initialize();
    RankiMetrics.initialize();
  }
}

// remember to turn off geometry observability if you turn this off. the logistics of getting state over there hasn't been implemented
RankiO11y.initialize();
