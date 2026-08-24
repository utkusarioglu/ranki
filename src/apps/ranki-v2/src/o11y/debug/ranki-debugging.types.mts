import type { RankiLogDriverRegistryAddManyProps } from "../driver-registry/driver-registry.types.mjs";
import type { ConsoleBatchLogDriverConstructorParams } from "../log-drivers/console-batch/console-batch.types.mjs";
import type { FileBatchLogDriverConstructorParams } from "../log-drivers/file-batch/file-batch.types.mjs";

export interface RankiDebuggingRuntimeProps {
  drivers: {
    consoleBatch: ConsoleBatchLogDriverConstructorParams;
    fileBatch: FileBatchLogDriverConstructorParams;
  };
}

export interface RankiDebuggingStaticConfiguration {
  drivers: RankiLogDriverRegistryAddManyProps;
}
