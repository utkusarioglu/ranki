import { RankiAppError } from "../../error/ranki-app-error.mts";
import type { MatchTypes } from "../config.types.mts";

import type {
  AnkiCard,
  AnkiCardFace,
  AnkiCardType,
  AnkiDeck,
  AnkiRawTag,
} from "../collect/collect.types.mjs";
import type { DeckSettings } from "../config.types.mts";
import { assertNever } from "../../error/assertions.mts";
import { isGlobMatch } from "./glob-match.mts";
import { ANKI_DECK_SEPARATOR } from "../config.constants.mts";

export function checkIfMatch(
  currentDeck: AnkiDeck | AnkiCard | AnkiCardType | AnkiCardFace | AnkiRawTag,
  matchers: DeckSettings[],
): DeckSettings | undefined {
  for (const matcher of matchers) {
    const matchType = getMatchType(matcher);
    if (matchType === "multi") {
      throw new RankiAppError({
        code: "DECK_MULTIPLE_MATCHERS",
        why: "Deck spec can only define one of glob, regex, exact",
        cause: null,
        details: { deck: matcher },
      });
    }
    switch (matchType) {
      case "exact":
        if (matcher.exact === currentDeck) {
          return matcher;
        }
        break;
      case "glob":
        if (isGlobMatch(currentDeck, matcher.glob, ANKI_DECK_SEPARATOR)) {
          return matcher;
        }
        break;
      case "regex":
        if (new RegExp(matcher.regex).test(currentDeck)) {
          return matcher;
        }
        break;
      default:
        assertNever({
          why: "Unrecognized match type",
          details: { matchType, deck: matcher },
        });
    }
  }
  return undefined;
}

export function getMatchType<T extends Record<MatchTypes, {}>>(
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
