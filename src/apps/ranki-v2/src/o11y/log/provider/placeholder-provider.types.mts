import type { LogRecord } from "@opentelemetry/api-logs";
import type { LogDriver } from "../ranki-logging.types.mjs";

export interface MyLoggerProviderConstructorProps {
  drivers: LogDriver[];
}

export type LogToDriversFunc = (p: LogRecord) => void;
