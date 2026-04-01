/**
 * General type definitions for the sanitization process.
 *
 * This module defines common types used across the sanitization modules,
 * particularly for handling parse results that may succeed or fail.
 */

import type { DqmParseOutput } from "@dqm/package-dqm-api-v2";

/**
 * Represents a successful parse result containing the parsed data.
 */
interface SanitizeResultSuccess {
  /** Indicates the parsing was successful. */
  state: "success";
  /** The successfully parsed data. */
  data: DqmParseOutput;
}

/**
 * Represents a failed parse result with an error message.
 */
interface ParseResultFail {
  /** Indicates the parsing failed. */
  state: "fail";
  /** The error message describing what went wrong. */
  error: string;
}

/**
 * Union type representing either a successful or failed parse result.
 * This is used throughout the sanitization process to handle both success and error cases.
 */
export type SanitizedParseResult = SanitizeResultSuccess | ParseResultFail;
