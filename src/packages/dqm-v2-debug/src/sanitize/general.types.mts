/**
 * General type definitions for the sanitization process.
 *
 * This module defines common types used across the sanitization modules,
 * particularly for handling parse results that may succeed or fail.
 *
 * @aidoc
 */

import type { DqmParseOutput } from "@dqm/package-dqm-api-v2";

/**
 * Represents a successful parse result containing the parsed data.
 *
 * @dev
 * #1 Indicates the parsing was successful.
 * #2 The successfully parsed data.
 *
 * @aidoc
 */
interface SanitizeResultSuccess {
  state: "success"; // #1
  data: DqmParseOutput; // #2
}

/**
 * Represents a failed parse result with an error message.
 *
 * @dev
 * #1 Indicates the parsing failed.
 * #2 The error message describing what went wrong.
 *
 * @aidoc
 */
interface ParseResultFail {
  state: "fail"; // #1
  error: string; // #2
}

/**
 * Union type representing either a successful or failed parse result.
 * This is used throughout the sanitization process to handle both success and error cases.
 */
export type SanitizedParseResult = SanitizeResultSuccess | ParseResultFail;
