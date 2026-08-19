import { ConsoleBatchLogDriver } from "./log-drivers/console-batch/console-batch.mjs";
import { LokiLogDriver } from "./log-drivers/loki/loki.mjs";
import { yamlPrinter } from "./log-drivers/console-batch/yaml-printer.mjs";

export const consoleBatchLogDriver = new ConsoleBatchLogDriver({
  printer: yamlPrinter,
});

export const lokiLogDriver = new LokiLogDriver({
  loki: {
    endpoint: "/loki/api/v1/push",
  },
  scheduler: {
    enabled: true,
    interval: 5000,
  },
});
