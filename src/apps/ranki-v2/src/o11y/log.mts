import { ConsoleBatchLogDriver } from "./log-drivers/console-batch/console-batch.mjs";
import { LokiLogDriver } from "./log-drivers/loki/loki.mjs";

export const consoleBatchLogDriver = new ConsoleBatchLogDriver();
export const lokiLogDriver = new LokiLogDriver();
