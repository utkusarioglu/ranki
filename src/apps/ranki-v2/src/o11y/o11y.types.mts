import type { DebugLogDriver } from "_controllers/geometry/o11y/debug/debug.types.mjs";

import type {
  RankiDebuggingRuntimeProps,
  RankiDebuggingStaticConfiguration,
} from "./debug/ranki-debugging.types.mjs";
import type { ConsoleBatchLoggerPrinterFuncRecord } from "./log-drivers/console-batch/console-batch.types.mjs";
import type { LogProcessorConfigureProps } from "./log-drivers/utils/log-processor/log-processor.types.mjs";
import type {
  LogDriver,
  RankiLoggingStaticConfiguration,
  RankiLogRuntimeProps,
} from "./log/ranki-logging.types.mjs";
import type { RankiMeteringRuntimeProps } from "./meter/ranki-metering.types.mjs";
import type { RankiTracingRuntimeProps } from "./trace/ranki-tracing.types.mjs";

export interface RankiO11yConsoleAccess {
  debug: DebugLogDriver | undefined;
  log: LogDriver | undefined;
}

export interface RankiO11yRuntimeProps {
  debug: RankiDebuggingRuntimeProps;
  log: RankiLogRuntimeProps;
  meter: RankiMeteringRuntimeProps;
  trace: RankiTracingRuntimeProps;
}

export interface RankiO11yStaticConfiguration {
  debug: RankiDebuggingStaticConfiguration;
  log: RankiLoggingStaticConfiguration;
  printers: ConsoleBatchLoggerPrinterFuncRecord;
  processors: LogProcessorConfigureProps;
}
