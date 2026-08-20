import type { ConsoleBatchLogDriver } from "./log-drivers/console-batch/console-batch.mjs";
import type {
  ConsoleBatchLogDriverConfigureProps,
  ConsoleBatchLogDriverConstructorParams,
} from "./log-drivers/console-batch/console-batch.types.mjs";
import type { LokiLogDriver } from "./log-drivers/loki/loki.mjs";
import type { LokiLogDriverConstructorParams } from "./log-drivers/loki/loki.types.mjs";

export interface RankiLogsDrivers {
  consoleBatchLogDriver: ConsoleBatchLogDriver | null;
  lokiLogDriver: LokiLogDriver | null;
}

interface RankiLogsStaticConfig {
  consoleBatch: ConsoleBatchLogDriverConfigureProps;
}

export interface RankiLogRuntimeProps {
  drivers: {
    loki: LokiLogDriverConstructorParams;
    consoleBatch: ConsoleBatchLogDriverConstructorParams;
  };
}
export type RankiLogsStaticConfigProps = Partial<RankiLogsStaticConfig>;
