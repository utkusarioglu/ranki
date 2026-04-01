/**
 * Error code constants for DQM debug errors.
 *
 * This module defines string constants for all possible error codes
 * that can be thrown by the DQM debug system.
 */

/**
 * Constants for DQM debug error codes.
 * These are used as keys in error code mappings and validation.
 */
export const DQM_DEBUG_ERROR_CONSTANTS = {
  /** Error code for when a value is unexpectedly undefined. */
  VALUE_UNDEFINED: "VALUE_UNDEFINED",
  /** Error code for when a try-catch operation results in failure. */
  TRY_CATCH_FAIL: "TRY_CATCH_FAIL",
} as const;
