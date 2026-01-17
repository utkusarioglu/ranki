import { RankiAppError } from "../error/ranki-app-error.mts";
import type { MatchTypes } from "./config.types.mts";

export function determineMatchType<T extends Record<MatchTypes, {}>>(
  a: T,
): MatchTypes | "multi" {
  const isExact = a.exact !== undefined;
  const isRegex = a.regex !== undefined;
  const isGlob = a.glob !== undefined;
  const manyMatch = [isExact, isRegex, isGlob].filter((v) => v).length > 1;
  if (manyMatch) {
    return "multi";
  } else if (isExact) {
    return "exact";
  } else if (isRegex) {
    return "regex";
  } else if (isGlob) {
    return "glob";
  } else {
    throw new RankiAppError({
      code: "UNKNOWN_MATCHER",
      why: "Unrecognized matcher returned",
      cause: null,
      details: { item: a },
    });
  }
}
