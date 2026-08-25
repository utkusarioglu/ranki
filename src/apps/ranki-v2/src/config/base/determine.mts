import type {
  AnkiCard,
  AnkiCardFace,
  AnkiCardType,
  AnkiDeck,
  AnkiRawTag,
} from "_collect/collect.types.mjs";
import type {
  DeckExactSettings,
  DeckGlobSettings,
  DeckRegexSettings,
  MatchTypes,
} from "_config/config.types.mjs";
import type { DeckSettings } from "_config/config.types.mjs";

import { RankiAppError } from "_/error/ranki-app-error.mjs";
import { ANKI_DECK_SEPARATOR } from "_config/config.constants.mjs";
import { assertNever } from "_error/assertions.mjs";

import { isGlobMatch } from "./glob-match.mjs";

export function checkIfMatch(
  currentDeck: AnkiCard | AnkiCardFace | AnkiCardType | AnkiDeck | AnkiRawTag,
  matchers: DeckSettings[],
): DeckSettings | undefined {
  for (const matcher of matchers) {
    const matchType = getMatchType(matcher);
    if (matchType === "multi") {
      throw new RankiAppError({
        cause: null,
        code: "DECK_MULTIPLE_MATCHERS",
        details: { deck: matcher },
        why: "Deck spec can only define one of glob, regex, exact",
      });
    }
    switch (matchType) {
      case "exact":
        if ((matcher as DeckExactSettings).exact === currentDeck) {
          return matcher;
        }
        break;
      case "glob":
        if (
          isGlobMatch(
            currentDeck,
            (matcher as DeckGlobSettings).glob,
            ANKI_DECK_SEPARATOR,
          )
        ) {
          return matcher;
        }
        break;
      case "regex":
        if (
          new RegExp((matcher as DeckRegexSettings).regex).test(currentDeck)
        ) {
          return matcher;
        }
        break;
      default:
        assertNever({
          details: { deck: matcher, matchType },
          why: "Unrecognized match type",
        });
    }
  }
  return undefined;
}

function getMatchType<T extends DeckSettings>(a: T): "multi" | MatchTypes {
  const isExact = (a as DeckExactSettings).exact !== undefined;
  const isRegex = (a as DeckRegexSettings).regex !== undefined;
  const isGlob = (a as DeckGlobSettings).glob !== undefined;
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
      cause: null,
      code: "UNKNOWN_MATCHER",
      details: { item: a },
      why: "Unrecognized matcher returned",
    });
  }
}
