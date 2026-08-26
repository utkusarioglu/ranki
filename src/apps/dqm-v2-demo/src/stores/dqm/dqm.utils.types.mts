//MOVED
import type { DqmParseOutput } from "@dqm/package-dqm-api-v2";

export type SanitizedParseResult = ParseResultFail | SanitizeResultSuccess;

interface ParseResultFail {
  error: string;
  state: "fail";
}

interface SanitizeResultSuccess {
  data: DqmParseOutput;
  state: "success";
}
