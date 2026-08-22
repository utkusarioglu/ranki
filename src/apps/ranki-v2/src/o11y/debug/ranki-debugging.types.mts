import type { ConsoleBatchLogDriverConstructorParams } from "../log-drivers/console-batch/console-batch.types.mjs";
import type { FileBatchLogDriverConstructorParams } from "../log-drivers/file-batch/file-batch.types.mjs";
import type { CallbackLogDriverConstructorParams } from "../log-drivers/callback/callback.types.mjs";

export interface RankiDebuggingRuntimeProps {
  drivers: {
    consoleBatch: ConsoleBatchLogDriverConstructorParams;
    fileBatch: FileBatchLogDriverConstructorParams;
    callback: CallbackLogDriverConstructorParams;
  };
}
