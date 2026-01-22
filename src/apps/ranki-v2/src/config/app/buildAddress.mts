import { assertExists } from "@dqm/package-dqm-utils";
import type { HudAddressSegment } from "../../components/hud/hud.types.mts";
import type { AnkiDeck, AnkiDeckParts } from "../collect/collect.types.mts";
import { ANKI_DECK_SEPARATOR } from "../config.constants.mts";
import type {
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
      si = marker < 0 ? parts.length + marker + 1 : marker;
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
  // const si =
  //   typeof marker === "number"
  //     ? marker < 0
  //       ? parts.length + marker + 1
  //       : marker
  //     : parts.indexOf(marker as AnkiDeck);
  // console.log(si, marker, parts.length);
  // assertExists(si, {
  //   why: "Start index has to exist",
  //   details: { parts, marker },
  // });
  return si;
}

export function buildAddressSegments(
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

  console.log("p", partMode);

  const address = partMode
    .map((mode, i) => ({
      mode,
      text: parts[i]!,
    }))
    .reduce((a, c) => {
      for (let m of ["hide", "trim"]) {
        if (a.at(-1)?.mode === m && c.mode === m) {
          return a;
        }
      }
      a.push(c);
      return a;
    }, [] as HudAddressSegment[]);

  console.log("a", address);

  return address;
}
