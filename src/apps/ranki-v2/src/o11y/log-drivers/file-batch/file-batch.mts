import type { LogDriver, LogValue } from "_/o11y/log/ranki-logging.types.mjs";
import { Scheduler } from "../utils/scheduler.utils.mjs";
import type { LogSanitizers } from "../console-batch/console-batch.types.mjs";
import { assertNotUndefined } from "_error/assertions.mjs";
import type { PathLike } from "node:fs";
import { FILE_BATCH_LOG_DRIVER_URL } from "./file-batch.constants.mjs";
import type {
  FileBatchRawLogEntry,
  FileBatchLogDriverStaticConfig,
  FileBatchLogDriverConstructorParams,
  FileBatchLogDriverConfigureProps,
} from "./file-batch.types.mjs";

export class FileBatchLogDriver implements LogDriver {
  private readonly scheduler: Scheduler<FileBatchRawLogEntry>;
  private static config: FileBatchLogDriverStaticConfig = {
    sanitizers: {
      none: (v) => v as LogValue[],
    },
  };
  private sanitizerName: LogSanitizers = "none";
  private fileRelPath: PathLike;

  constructor(params?: FileBatchLogDriverConstructorParams) {
    if (params?.sanitizer) this.sanitizerName = params.sanitizer;
    this.scheduler = new Scheduler(
      (v) => this.fileSaver(v),
      params?.scheduler?.interval,
    );
    if (params?.scheduler?.enabled) this.scheduler.start();
    this.fileRelPath = params?.filePath || "debug.log";
  }

  public static configure(conf: FileBatchLogDriverConfigureProps) {
    this.config.sanitizers = { ...this.config.sanitizers, ...conf.sanitizers };
  }

  private getSanitizer() {
    const printer = FileBatchLogDriver.config.sanitizers[this.sanitizerName];
    assertNotUndefined(printer, {
      details: {
        printerName: this.sanitizerName,
        printers: FileBatchLogDriver.config.sanitizers,
      },
      why: "undefined printer",
    });
    return printer;
  }

  private async fileSaver(v: FileBatchRawLogEntry[]) {
    const sanitizer = this.getSanitizer();
    const sanitized = v.map((a) => JSON.stringify(sanitizer(a))).join("\n");
    console.log("savl");

    await fetch([FILE_BATCH_LOG_DRIVER_URL, this.fileRelPath].join("/"), {
      method: "POST",
      body: sanitized,
    });
  }

  log(value: FileBatchRawLogEntry): void {
    this.scheduler.enqueue(value);
  }
}
