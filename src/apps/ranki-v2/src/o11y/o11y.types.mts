import type { DebugLogDriver } from "_controllers/geometry/o11y/debug/debug.types.mjs";
import type {
  RankiDebuggingRuntimeProps,
  RankiDebuggingStaticConfiguration,
} from "./debug/ranki-debugging.types.mjs";
import type { ConsoleBatchLoggerPrinterFuncRecord } from "./log-drivers/console-batch/console-batch.types.mjs";
import type { LogProcessorConfigureProps } from "./log-drivers/utils/log-processor/log-processor.types.mjs";
import type {
  LogDriver,
  RankiLogRuntimeProps,
  RankiLoggingStaticConfiguration,
} from "./log/ranki-logging.types.mjs";
import type { RankiMeteringRuntimeProps } from "./meter/ranki-metering.types.mjs";
import type { RankiTracingRuntimeProps } from "./trace/ranki-tracing.types.mjs";

export interface RankiO11yRuntimeProps {
  log: RankiLogRuntimeProps;
  meter: RankiMeteringRuntimeProps;
  trace: RankiTracingRuntimeProps;
  debug: RankiDebuggingRuntimeProps;
}

export interface RankiO11yStaticConfiguration {
  debug: RankiDebuggingStaticConfiguration;
  log: RankiLoggingStaticConfiguration;
  processors: LogProcessorConfigureProps;
  printers: ConsoleBatchLoggerPrinterFuncRecord;
}

export interface RankiO11yConsoleAccess {
  log: LogDriver | undefined;
  debug: DebugLogDriver | undefined;
}
