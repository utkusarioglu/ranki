import type { ConsoleBatchLogDriverConstructorParams } from "../log-drivers/console-batch/console-batch.types.mjs";
import type { FileBatchLogDriverConstructorParams } from "../log-drivers/file-batch/file-batch.types.mjs";
import type { HtmlLogDriverConstructorParams } from "../log-drivers/html/html.types.mjs";

export interface RankiDebuggingRuntimeProps {
  drivers: {
    consoleBatch: ConsoleBatchLogDriverConstructorParams;
    fileBatch: FileBatchLogDriverConstructorParams;
    html: HtmlLogDriverConstructorParams;
  };
}
