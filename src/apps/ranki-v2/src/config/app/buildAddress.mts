import { assertExists } from "@dqm/package-dqm-utils";
import type {
  HudAddressSegment,
  HudAddressSegmentPart,
  HudAddressSegmentWithParts,
} from "../../components/hud/hud.types.mts";
import type { AnkiDeck, AnkiDeckParts } from "../collect/collect.types.mts";
import { ANKI_DECK_SEPARATOR } from "../config.constants.mts";
import type {
  RankiAddressTokens,
  RankiBaseAddressMutation,
  RankiBaseAddressMutationMode,
} from "../config.types.mts";
import { MUTATION_MODE_PRECEDENCE } from "./app.mts";
import { assertNever } from "../../error/assertions.mts";
import { RankiAppError } from "../../error/ranki-app-error.mts";

function translateMarker(parts: AnkiDeckParts, marker: string | number) {
  let si: number;
  switch (typeof marker) {
    case "number":
      si = marker < 0 ? parts.length + marker : marker;
      if (si >= parts.length) {
        throw new RankiAppError({
          code: "INDEX_ERROR",
          why: "marker points to an out of bound index",
          details: { marker, parts, si },
          cause: null,
        });
      }
      return si;

    case "string":
      si = parts.indexOf(marker as AnkiDeck);
      if (si === -1) {
        throw new RankiAppError({
          code: "INDEX_ERROR",
          why: "marker string did not translate to an index",
          details: { marker, parts, si },
          cause: null,
        });
      }
      break;

    default:
      assertNever({
        why: "Address marker has to be either a string or a number",
        details: { marker, parts },
      });
  }
  return si;
}

export function buildAddressParts(
  tokens: RankiAddressTokens,
  mutations: RankiBaseAddressMutation[],
  deck: AnkiDeck,
): HudAddressSegment[] {
  const parts = deck.split(ANKI_DECK_SEPARATOR) as AnkiDeckParts;
  const partMode: RankiBaseAddressMutationMode[] = Array(parts.length).fill(
    "show",
  );
  mutations.forEach(({ start, end, mode }) => {
    const si = translateMarker(parts, start);
    const ei = translateMarker(parts, end);
    for (let pi = si; pi < ei; pi++) {
      const mi = MUTATION_MODE_PRECEDENCE.indexOf(mode);
      assertExists(mi, {
        why: "Unrecognized option for address mode",
        details: { mutations, deck, start, end, mode },
      });
      const ci = MUTATION_MODE_PRECEDENCE.indexOf(partMode[pi])!;
      if (ci > mi) {
        partMode[pi] = mode;
      }
    }
  });

  const address: HudAddressSegment[] = [];
  partLoop: for (let [i, c] of partMode.entries()) {
    const prev = address.at(-1);
    for (let m of ["hide", "trim"] as HudAddressSegmentPart["mode"][]) {
      if (prev?.mode === m && c === m) {
        (prev as HudAddressSegmentWithParts).parts.push({
          mode: m,
          shown: tokens[m],
          masked: parts[i],
        });
        continue partLoop;
      }
    }

    if (prev?.mode === "show" && c === "show") {
      address.push({
        mode: "separator",
        shown: [tokens.separator],
      });
    }

    switch (c) {
      case "trim":
      case "hide":
        if (prev && ["trim", "hide"].includes(prev.mode)) {
          prev.shown.push(tokens[c]);
          (prev as HudAddressSegmentWithParts).parts.push({
            mode: c,
            shown: tokens[c],
            masked: parts[i],
          });
        } else {
          const item = {
            mode: c,
            shown: [tokens[c]],
          };
          address.push({
            ...item,
            parts: [
              {
                mode: c,
                shown: tokens[c],
                masked: parts[i],
              },
            ],
          });
        }
        break;
      default:
        address.push({
          mode: c,
          shown: [parts[i]],
        });
    }
  }

  return address;
}
