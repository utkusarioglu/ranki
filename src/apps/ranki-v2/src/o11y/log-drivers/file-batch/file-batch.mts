import type { LogDriver } from "_/o11y/log/ranki-logging.types.mjs";
import type { PathLike } from "node:fs";

import type {
  FileBatchLogDriverConstructorParams,
  FileBatchRawLogEntry,
} from "./file-batch.types.mjs";

import { CallbackBatchLogDriver } from "../callback-batch/callback-batch.mjs";
import { FILE_BATCH_LOG_DRIVER_URL } from "./file-batch.constants.mjs";

export class FileBatchLogDriver implements LogDriver {
  private readonly back: CallbackBatchLogDriver;
  private fileRelPath: PathLike;

  constructor(params?: FileBatchLogDriverConstructorParams) {
    this.back = new CallbackBatchLogDriver(this.pushToServer.bind(this), {
      processor: {
        formatter: params?.formatter || "none",
        sanitizer: params?.sanitizer || "none",
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

  log(value: FileBatchRawLogEntry): void {
    this.back.log(value);
  }

  private async pushToServer(v: FileBatchRawLogEntry[]) {
    await fetch([FILE_BATCH_LOG_DRIVER_URL, this.fileRelPath].join("/"), {
      body: v.join("\n"),
      method: "POST",
    });
  }
}
