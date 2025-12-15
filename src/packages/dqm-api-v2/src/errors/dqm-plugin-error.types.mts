import type { DQM_PLUGIN_ERROR_CODES } from "../constants/errors.mjs";

export type IDqmPluginErrorRequiredParams = {
  code: DqmPluginErrorCode;
  why: string;
};

//   Pick<
//   DqmPluginErrorConstructorParams,
//   "code" | "why"
// >;

export type DqmPluginErrorCode = keyof typeof DQM_PLUGIN_ERROR_CODES;
