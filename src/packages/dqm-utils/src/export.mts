export { DqmBaseError } from "./base-error/base-error.mjs";
export * from "./assertions.mjs";
export * from "./decorators.mjs";

// DECIDE I don't like that these are here. you need to decide this import web
// between dqm, this utils package and ranki. they share a lot of code related
// to error management.
export type {
  IDqmErrorBaseRequiredParams,
  WithCause,
} from "@dqm/package-dqm-api-v2";
