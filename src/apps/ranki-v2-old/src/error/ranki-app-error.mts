import { DqmBaseError } from "@dqm/package-dqm-utils";
import type {
  IDqmErrorBaseRequiredParams,
  WithCause,
} from "@dqm/package-dqm-utils";
import { RANKI_APP_ERROR_CONSTANTS } from "./constants.mjs";

export type RankiAppErrorConstructorParams = WithCause &
  IDqmErrorBaseRequiredParams<keyof typeof RANKI_APP_ERROR_CONSTANTS>;

export class RankiAppError extends DqmBaseError {
  public errorType: string = "RANKI_APP";

  override getErrorText(code: keyof typeof RANKI_APP_ERROR_CONSTANTS): string {
    return code;
    // return DQM_APP_ERROR_CONSTANTS[code] || super.getDefaultErrorText(code);
  }

  override getAdditionalExtendedDetails(): Record<string, any> {
    return {
      is: "Ranki",
    };
  }

  override getAdditionalDetails(): Record<string, any> {
    return {};
  }
}
