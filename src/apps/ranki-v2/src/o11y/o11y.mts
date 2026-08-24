import { RankiDebugging } from "./debug/ranki-debugging.mjs";
import { RankiLogging } from "./log/ranki-logging.mjs";
import { RankiMetering } from "./meter/ranki-metering.mjs";
import type {
  RankiO11yRuntimeProps,
  RankiO11yStaticConfiguration,
} from "./o11y.types.mjs";
import { RankiTracing } from "./trace/ranki-tracing.mjs";
import { LogProcessor } from "./log-drivers/utils/log-processor/log-processor.mjs";
import { LogPrinter } from "./log-drivers/utils/log-printer/log-printer.mjs";

export class RankiO11y {
  public static readonly log = RankiLogging;
  public static readonly meter = RankiMetering;
  public static readonly trace = RankiTracing;
  public static readonly debug = RankiDebugging;

  public static enable(props: RankiO11yRuntimeProps) {
    this.debug.enable(props.debug);
    this.log.enable(props.log);
    this.trace.enable(props.trace);
    this.meter.enable(props.meter);
  }

  public static getConsoleAccess() {
    return {
      log: this.log.getConsoleAccess(),
      debug: this.debug.getConsoleAccess(),
    };
  }

  public static configure(r: RankiO11yStaticConfiguration) {
    RankiDebugging.configure(r.debug);
    RankiLogging.configure(r.log);
    LogProcessor.configure(r.processors);
    LogPrinter.configure(r.printers);
  }
}
