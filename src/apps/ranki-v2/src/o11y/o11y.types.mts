import type { RankiDebuggingRuntimeProps } from "./debug/ranki-debugging.types.mjs";
import type { RankiLogRuntimeProps } from "./log/ranki-logging.types.mjs";
import type { RankiMeteringRuntimeProps } from "./meter/ranki-metering.types.mjs";
import type { RankiTracingRuntimeProps } from "./trace/ranki-tracing.types.mjs";

export interface RankiO11yRuntimeProps {
  log: RankiLogRuntimeProps;
  meter: RankiMeteringRuntimeProps;
  trace: RankiTracingRuntimeProps;
  debug: RankiDebuggingRuntimeProps;
}
