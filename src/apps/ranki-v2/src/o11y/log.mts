import { geometry } from "_controllers/geometry/geometry.mjs";
import { BatchLogger } from "./loggers/batch-logger.mjs";

export const batchLogger = new BatchLogger();

geometry.addLogDriver(batchLogger);
