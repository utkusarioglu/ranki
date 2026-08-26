import type {
  RankiO11yConsoleAccess,
  RankiO11yRuntimeProps,
  RankiO11yStaticConfiguration,
} from "./o11y.types.mjs";

import { RankiDebugging } from "./debug/ranki-debugging.mjs";
import { LogPrinter } from "./log-drivers/utils/log-printer/log-printer.mjs";
import { LogProcessor } from "./log-drivers/utils/log-processor/log-processor.mjs";
import { RankiLogging } from "./log/ranki-logging.mjs";
import { RankiMetering } from "./meter/ranki-metering.mjs";
import { RankiTracing } from "./trace/ranki-tracing.mjs";

export class RankiO11y {
  public static readonly debug = RankiDebugging;
  public static readonly log = RankiLogging;
  public static readonly meter = RankiMetering;
  public static readonly trace = RankiTracing;

  public static configure(r: RankiO11yStaticConfiguration) {
    RankiDebugging.configure(r.debug);
    RankiLogging.configure(r.log);
    LogProcessor.configure(r.processors);
    LogPrinter.configure(r.printers);
  }

  public static enable(props: RankiO11yRuntimeProps) {
    this.debug.enable(props.debug);
    this.log.enable(props.log);
    this.trace.enable(props.trace);
    this.meter.enable(props.meter);
  }

  public static getConsoleAccess(): RankiO11yConsoleAccess {
    return {
      debug: this.debug.getConsoleAccess(),
      log: this.log.getConsoleAccess(),
    };
  }
}
