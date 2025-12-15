import type { DQM_PLUGIN_ERROR_CODES } from "../constants/errors.mjs";
import type { IDqmError } from "./i-dqm-error.types.mjs";

export type IDqmPluginErrorCode = keyof typeof DQM_PLUGIN_ERROR_CODES;

export interface IDqmPluginError extends IDqmError {}
