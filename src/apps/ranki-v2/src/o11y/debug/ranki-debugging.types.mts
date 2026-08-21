import type { ConsoleBatchLogDriverConstructorParams } from "../log/log-drivers/console-batch/console-batch.types.mjs";

export interface RankiDebuggingRuntimeProps {
  drivers: {
    consoleBatch: ConsoleBatchLogDriverConstructorParams;
  };
}
