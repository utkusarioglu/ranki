import type { DevtoolsLogDriver } from "_controllers/geometry/o11y/devtools/devtools.types.mjs";

import type {
  RankiO11yDevtoolsRuntimeProps,
  RankiO11yDevtoolsStaticConfiguration,
} from "./devtools/ranki-devtools.types.mjs";
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
  devtools: DevtoolsLogDriver | undefined;
  log: LogDriver | undefined;
}

export interface RankiO11yRuntimeProps {
  devtools: RankiO11yDevtoolsRuntimeProps;
  log: RankiLogRuntimeProps;
  meter: RankiMeteringRuntimeProps;
  trace: RankiTracingRuntimeProps;
}

export interface RankiO11yStaticConfiguration {
  devtools: RankiO11yDevtoolsStaticConfiguration;
  log: RankiLoggingStaticConfiguration;
  printers: ConsoleBatchLoggerPrinterFuncRecord;
  processors: LogProcessorConfigureProps;
}
