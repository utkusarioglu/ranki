import type {
  IDqmAppError,
  IDqmErrorBaseRequiredParams,
  WithCause,
} from "@dqm/package-dqm-api-v2";
import { DqmBaseError } from "@dqm/package-dqm-utils";
import { DQM_DEBUG_ERROR_CONSTANTS } from "./dqm-debug-error.constants.mjs";

export type DqmPluginErrorConstructorParams = WithCause &
  IDqmErrorBaseRequiredParams<keyof typeof DQM_DEBUG_ERROR_CONSTANTS>;

export class DqmDebugError extends DqmBaseError implements IDqmAppError {
  public errorType: string = "DQM_APP";

  override getErrorText(code: keyof typeof DQM_DEBUG_ERROR_CONSTANTS): string {
    return DQM_DEBUG_ERROR_CONSTANTS[code] || super.getDefaultErrorText(code);
  }

  override getAdditionalExtendedDetails(): Record<string, any> {
    return {
      is: "App",
    };
  }

  override getAdditionalDetails(): Record<string, any> {
    return {};
  }
}
