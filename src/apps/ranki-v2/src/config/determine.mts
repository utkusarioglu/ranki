import type {
  AnkiCard,
  AnkiCardFace,
  AnkiCardType,
  AnkiDeck,
  AnkiRawTag,
} from "../collect/collect.types.mjs";
import { RankiAppError } from "../error/ranki-app-error.mts";
import type { DeckSettings } from "./config.types.mts";
import { assertNever } from "../error/assertions.mts";
import { determineMatchType } from "./match.mts";
import { isGlobMatch } from "./glob-match.mts";
import { ANKI_DECK_SEPARATOR } from "./config.constants.mts";

export function checkMatch(
  currentDeck: AnkiDeck | AnkiCard | AnkiCardType | AnkiCardFace | AnkiRawTag,
  matchers: DeckSettings[],
): DeckSettings | undefined {
  for (const matcher of matchers) {
    const matchType = determineMatchType(matcher);
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
