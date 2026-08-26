import type {
  IDqmErrorBaseRequiredParams,
  WithCause,
} from "@dqm/package-dqm-utils";

import { DqmBaseError } from "@dqm/package-dqm-utils";

import { RANKI_APP_ERROR_CONSTANTS } from "./constants.mjs";

export type RankiAppErrorConstructorParams = IDqmErrorBaseRequiredParams<
  keyof typeof RANKI_APP_ERROR_CONSTANTS
> &
  WithCause;

export class RankiAppError extends DqmBaseError {
  public errorType: string = "RANKI_APP";

  override getAdditionalDetails(): Record<
    string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    any
  > {
    return {};
  }

  override getAdditionalExtendedDetails(): Record<
    string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    any
  > {
    return {
      is: "Ranki",
    };
  }

  override getErrorText(code: keyof typeof RANKI_APP_ERROR_CONSTANTS): string {
    return code;
    // return DQM_APP_ERROR_CONSTANTS[code] || super.getDefaultErrorText(code);
  }
}
