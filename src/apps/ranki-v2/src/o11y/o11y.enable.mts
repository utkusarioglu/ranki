import { RankiO11y } from "./o11y.mjs";

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
