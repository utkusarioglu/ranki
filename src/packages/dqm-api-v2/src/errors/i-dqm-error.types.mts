import type { IDqmPluginErrorCode } from "./i-dqm-plugin-error.types.mjs";

export type ErrorCodeBase = string;

export type IDqmErrorBaseRequiredParams<T extends ErrorCodeBase> = {
  code: T;
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
  readonly cause: IDqmErrorCause;
  toString(): string;
  toExtendedJSON(): object;
  toJSON(): object;
}

export type IDqmErrorCause = IDqmError | null | unknown;

export type WithCause = {
  cause: IDqmErrorCause;
};
