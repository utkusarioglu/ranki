import type { ConsoleBatchLogDriver } from "./log-drivers/console-batch/console-batch.mjs";
import type {
  ConsoleBatchLogDriverConfigureProps,
  ConsoleBatchLogDriverConstructorParams,
} from "./log-drivers/console-batch/console-batch.types.mjs";
import type { LokiLogDriver } from "./log-drivers/loki/loki.mjs";
import type { LokiLogDriverConstructorParams } from "./log-drivers/loki/loki.types.mjs";

export interface RankiLogRuntimeProps {
  drivers: {
    consoleBatch: ConsoleBatchLogDriverConstructorParams;
    loki: LokiLogDriverConstructorParams;
  };
}

export interface RankiLogsDrivers {
  consoleBatchLogDriver: ConsoleBatchLogDriver | null;
  lokiLogDriver: LokiLogDriver | null;
}

export type RankiLogsStaticConfigProps = Partial<RankiLogsStaticConfig>;
interface RankiLogsStaticConfig {
  consoleBatch: ConsoleBatchLogDriverConfigureProps;
}
