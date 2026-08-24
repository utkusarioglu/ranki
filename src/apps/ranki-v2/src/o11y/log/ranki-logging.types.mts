import type { RankiLogDriverRegistryAddManyProps } from "../driver-registry/driver-registry.types.mjs";
import type { ConsoleBatchLogDriver } from "../log-drivers/console-batch/console-batch.mjs";
import type { ConsoleBatchLogDriverConstructorParams } from "../log-drivers/console-batch/console-batch.types.mjs";
import type { FileBatchLogDriverConstructorParams } from "../log-drivers/file-batch/file-batch.types.mjs";
import type { LokiLogDriver } from "../log-drivers/loki/loki.mjs";
import type { LokiLogDriverConstructorParams } from "../log-drivers/loki/loki.types.mjs";
import type { LogRecord } from "@opentelemetry/api-logs";

export interface RankiLogRuntimeProps {
  drivers: Partial<{
    consoleBatch: ConsoleBatchLogDriverConstructorParams;
    loki: LokiLogDriverConstructorParams;
    fileBatch: FileBatchLogDriverConstructorParams;
  }>;
}

export interface RankiLogsDrivers {
  consoleBatchLogDriver: ConsoleBatchLogDriver | null;
  lokiLogDriver: LokiLogDriver | null;
}

// export type RankiLogsStaticConfigProps = Partial<RankiLogsStaticConfig>;

export interface RankiLoggingStaticConfiguration {
  drivers: RankiLogDriverRegistryAddManyProps;
}

export interface LogDriver {
  log(value: LogValue): void;
}

export type LogValue = LogRecord;
