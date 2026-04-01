/**
 * DQM Debug Error class and related types.
 *
 * This module defines the DqmDebugError class, which extends the base DQM error
 * system to provide specific error handling for debug operations.
 *
 * @aidoc
 */

import type {
  IDqmAppError,
  IDqmErrorBaseRequiredParams,
  WithCause,
} from "@dqm/package-dqm-api-v2";
import { DqmBaseError } from "@dqm/package-dqm-utils";
import { DQM_DEBUG_ERROR_CONSTANTS } from "./dqm-debug-error.constants.mjs";

/**
 * Constructor parameters for creating a DqmDebugError.
 * Includes the error code (restricted to debug error constants) and optional cause.
 */
export type DqmPluginErrorConstructorParams = WithCause &
  IDqmErrorBaseRequiredParams<keyof typeof DQM_DEBUG_ERROR_CONSTANTS>;

/**
 * Error class for DQM debug operations.
 * Extends the base DQM error system with debug-specific error codes and handling.
 *
 * @aidoc
 */
export class DqmDebugError extends DqmBaseError implements IDqmAppError {
  /** The error type identifier for this error class. */
  public errorType: string = "DQM_APP";

  /**
   * Gets the human-readable error text for a given error code.
   * @param code - The error code to get text for.
   * @returns The error message text.
   *
   * @aidoc
   */
  override getErrorText(code: keyof typeof DQM_DEBUG_ERROR_CONSTANTS): string {
    return DQM_DEBUG_ERROR_CONSTANTS[code] || super.getDefaultErrorText(code);
  }

  /**
   * Gets additional extended details for error reporting.
   * @returns An object with extended error details.
   *
   * @aidoc
   */
  override getAdditionalExtendedDetails(): Record<string, any> {
    return {
      is: "App",
    };
  }

  /**
   * Gets additional details for error reporting.
   * @returns An object with error details.
   *
   * @aidoc
   */
  override getAdditionalDetails(): Record<string, any> {
    return {};
  }
}
