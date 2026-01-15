// import type {
//   IDqmAppError,
//   IDqmErrorBaseRequiredParams,
//   WithCause,
// } from "@dqm/package-dqm-api-v2";
// import { DQM_APP_ERROR_CONSTANTS } from "./dqm-app-error.constants.mjs";
import { DqmBaseError } from "@dqm/package-dqm-utils";

// export type DqmPluginErrorConstructorParams = WithCause &
//   IDqmErrorBaseRequiredParams<keyof typeof DQM_APP_ERROR_CONSTANTS>;

export class RankiAppError extends DqmBaseError {
  public errorType: string = "RANKI_APP";

  // @ts-expect-error
  override getErrorText(code: keyof typeof DQM_APP_ERROR_CONSTANTS): string {
    // @ts-expect-error
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
