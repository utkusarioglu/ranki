import { DqmBaseError } from "@dqm/package-dqm-utils";
import { DQM_DEBUG_ERROR_CONSTANTS } from "./dqm-debug-error.constants.mjs";
export class DqmDebugError extends DqmBaseError {
    errorType = "DQM_APP";
    getErrorText(code) {
        return DQM_DEBUG_ERROR_CONSTANTS[code] || super.getDefaultErrorText(code);
    }
    getAdditionalExtendedDetails() {
        return {
            is: "App",
        };
    }
    getAdditionalDetails() {
        return {};
    }
}
