import { RankiAppError } from "_/error/ranki-app-error.mjs";
import type {
  DeckExactSettings,
  DeckGlobSettings,
  DeckRegexSettings,
  MatchTypes,
} from "_config/config.types.mjs";

import type {
  AnkiCard,
  AnkiCardFace,
  AnkiCardType,
  AnkiDeck,
  AnkiRawTag,
} from "_collect/collect.types.mjs";
import type { DeckSettings } from "_config/config.types.mjs";
import { assertNever } from "_error/assertions.mjs";
import { isGlobMatch } from "./glob-match.mjs";
import { ANKI_DECK_SEPARATOR } from "_config/init/config.constants.mjs";

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
          why: "Unrecognized match type",
          details: { matchType, deck: matcher },
        });
    }
  }
  return undefined;
}

function getMatchType<T extends DeckSettings>(a: T): MatchTypes | "multi" {
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
      code: "UNKNOWN_MATCHER",
      why: "Unrecognized matcher returned",
      cause: null,
      details: { item: a },
    });
  }
}
