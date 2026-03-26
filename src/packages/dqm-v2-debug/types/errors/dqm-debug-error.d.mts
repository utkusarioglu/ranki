import type { IDqmAppError, IDqmErrorBaseRequiredParams, WithCause } from "@dqm/package-dqm-api-v2";
import { DqmBaseError } from "@dqm/package-dqm-utils";
import { DQM_DEBUG_ERROR_CONSTANTS } from "./dqm-debug-error.constants.mjs";
export type DqmPluginErrorConstructorParams = WithCause & IDqmErrorBaseRequiredParams<keyof typeof DQM_DEBUG_ERROR_CONSTANTS>;
export declare class DqmDebugError extends DqmBaseError implements IDqmAppError {
    errorType: string;
    getErrorText(code: keyof typeof DQM_DEBUG_ERROR_CONSTANTS): string;
    getAdditionalExtendedDetails(): Record<string, any>;
    getAdditionalDetails(): Record<string, any>;
}
//# sourceMappingURL=dqm-debug-error.d.mts.map