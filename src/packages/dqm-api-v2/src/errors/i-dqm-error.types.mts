import type { IDqmPluginErrorCode } from "./i-dqm-plugin-error.types.mjs";

export type IDqmPluginRequiredParams = {
  code: IDqmPluginErrorCode;
  why: string;
  details?: IDqmErrorDetails;
};

export type IDqmErrorFunc = (
  code: IDqmPluginErrorCode,
  why: string,
  details?: IDqmErrorDetails,
) => never;

export type IDqmErrorDetails = Record<string, any>;

export interface IDqmError extends Error {
  toDetailedJSON(): object;
  toJSON(): object;
}
