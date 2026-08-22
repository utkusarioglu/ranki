import type { LogDriver } from "_/o11y/log/ranki-logging.types.mjs";
import { Scheduler } from "../utils/scheduler.utils.mjs";
import type { PathLike } from "node:fs";
import { FILE_BATCH_LOG_DRIVER_URL } from "./file-batch.constants.mjs";
import type {
  FileBatchRawLogEntry,
  FileBatchLogDriverConstructorParams,
} from "./file-batch.types.mjs";
import { CallbackLogDriver } from "../callback/callback.mjs";

export class FileBatchLogDriver implements LogDriver {
  private readonly pipe: CallbackLogDriver;
  private readonly scheduler: Scheduler<FileBatchRawLogEntry>;
  private fileRelPath: PathLike;

  constructor(params?: FileBatchLogDriverConstructorParams) {
    this.pipe = new CallbackLogDriver({
      sanitizer: params?.sanitizer,
      formatter: params?.formatter,
      stringifier: params?.stringifier,
      callback: (v) => this.scheduler.enqueue(v),
    });
    this.scheduler = new Scheduler(
      (v) => this.pushToServer(v),
      params?.scheduler?.interval,
    );
    if (params?.scheduler?.enabled) this.scheduler.start();
    this.fileRelPath = params?.filePath || "debug.log";
  }

  private async pushToServer(v: FileBatchRawLogEntry[]) {
    await fetch([FILE_BATCH_LOG_DRIVER_URL, this.fileRelPath].join("/"), {
      method: "POST",
      body: v.join("\n"),
    });
  }

  log(value: FileBatchRawLogEntry): void {
    this.pipe.log(value);
  }
}
