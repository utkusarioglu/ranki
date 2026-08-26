import type {
  IDqmAppError,
  IDqmErrorBaseRequiredParams,
  WithCause,
} from "@dqm/package-dqm-api-v2";

import { DqmBaseError } from "@dqm/package-dqm-utils";

import { DQM_DEMO_ERROR_CONSTANTS } from "./dqm-demo-error.constants.mts";

export type DqmPluginErrorConstructorParams = IDqmErrorBaseRequiredParams<keyof typeof DQM_DEMO_ERROR_CONSTANTS> &
  WithCause;

export class DqmDemoError extends DqmBaseError implements IDqmAppError {
  public errorType: string = "DQM_APP";

  override getAdditionalDetails(): Record<string, any> {
    return {};
  }

  override getAdditionalExtendedDetails(): Record<string, any> {
    return {
      is: "App",
    };
  }

  override getErrorText(code: keyof typeof DQM_DEMO_ERROR_CONSTANTS): string {
    return DQM_DEMO_ERROR_CONSTANTS[code] || super.getDefaultErrorText(code);
  }
}
