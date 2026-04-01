import type {
  IDqmConfigError,
  IDqmErrorBaseRequiredParams,
  WithCause,
} from "@dqm/package-dqm-api-v2";
import { DqmBaseError } from "../base-error/base-error.mjs";

const DQM_UTIL_ERROR_CODES = {
  VALUE_DEFINED: "VALUE_DEFINED",
  VALUE_UNDEFINED: "VALUE_UNDEFINED",
  EMPTY_ARRAY: "EMPTY_ARRAY",
  METHOD_DECORATOR_ON_WRONG_CONTEXT: "METHOD_DECORATOR_ON_WRONG_CONTEXT",
  REQUIRES_PARENT: "REQUIRES_PARENT",
  REQUIRES_LEAF: "REQUIRES_LEAF",
  REQUIRED_VALUE_UNDEFINED: "REQUIRED_VALUE_UNDEFINED",
  VALUE_REJECTED: "VALUE_REJECTED",
  ALREADY_DEFINED: "ALREADY_DEFINED",
};

export type DqmPluginErrorConstructorParams = WithCause &
  IDqmErrorBaseRequiredParams<keyof typeof DQM_UTIL_ERROR_CODES>;

export class DqmUtilError extends DqmBaseError implements IDqmConfigError {
  public errorType: string = "DQM_UTIL";

  override getErrorText(code: keyof typeof DQM_UTIL_ERROR_CODES): string {
    return DQM_UTIL_ERROR_CODES[code] || super.getDefaultErrorText(code);
  }

  override getAdditionalExtendedDetails(): Record<string, any> {
    return {
      is: "Util error extended",
    };
  }

  override getAdditionalDetails(): Record<string, any> {
    return {
      isBasic: "basic util details",
    };
  }
}
