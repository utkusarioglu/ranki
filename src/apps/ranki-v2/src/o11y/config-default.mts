import type { RankiO11yRuntimeProps } from "./o11y.types.mjs";

export const DEFAULT_O11Y: RankiO11yRuntimeProps = {
  debug: {
    drivers: {
      consoleBatch: {
        formatter: "objectSorter",
        printer: "consoleLogRow",
        sanitizer: "none",
      },
      fileBatch: {
        filePath: "debugger.log",
        sanitizer: "basicRepresentation",
        scheduler: {
          enabled: true,
          interval: 5000,
        },
        stringifier: "jsonOneLine",
      },
    },
  },
  log: {
    drivers: {
      consoleBatch: {
        formatter: "objectSorter",
        printer: "yamlRow",
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
};
