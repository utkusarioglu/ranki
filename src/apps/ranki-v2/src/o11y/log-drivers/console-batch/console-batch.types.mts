import type { LogValue } from "_controllers/geometry/o11y/logger/logger.types.mjs";

export type ConsoleBatchLoggerPrinterFunc = (
  values: LogValue[],
  elapsed: number,
) => any;

export interface ConsoleBatchLogDriverConstructorParams {
  printer?: ConsoleBatchLoggerPrinterFunc;
}
