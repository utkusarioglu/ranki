import { geometry } from "_controllers/geometry/geometry.mjs";
import { BatchLogger } from "./batch-logger.mjs";

const batchLogger = new BatchLogger();

// @ts-expect-error declare global bla bla
window.logs = batchLogger;

geometry.addLogDriver(batchLogger);
