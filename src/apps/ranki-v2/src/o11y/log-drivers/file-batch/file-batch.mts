import type { LogDriver } from "_/o11y/log/ranki-logging.types.mjs";
import type { PathLike } from "node:fs";
import { FILE_BATCH_LOG_DRIVER_URL } from "./file-batch.constants.mjs";
import type {
  FileBatchRawLogEntry,
  FileBatchLogDriverConstructorParams,
} from "./file-batch.types.mjs";
import { CallbackBatchLogDriver } from "../callback-batch/callback-batch.mjs";

export class FileBatchLogDriver implements LogDriver {
  private readonly back: CallbackBatchLogDriver;
  private fileRelPath: PathLike;

  constructor(params?: FileBatchLogDriverConstructorParams) {
    this.back = new CallbackBatchLogDriver(this.pushToServer.bind(this), {
      processor: {
        sanitizer: params?.sanitizer || "none",
        formatter: params?.formatter || "none",
        stringifier: params?.stringifier || "none",
      },
      scheduler: {
        enabled: true,
        interval: 1e4,
        ...params?.scheduler,
      },
    });
    this.fileRelPath = params?.filePath || "debug.log";
  }

  private async pushToServer(v: FileBatchRawLogEntry[]) {
    await fetch([FILE_BATCH_LOG_DRIVER_URL, this.fileRelPath].join("/"), {
      method: "POST",
      body: v.join("\n"),
    });
  }

  log(value: FileBatchRawLogEntry): void {
    this.back.log(value);
  }
}
