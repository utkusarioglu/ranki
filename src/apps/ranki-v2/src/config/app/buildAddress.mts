import { assertExists } from "@dqm/package-dqm-utils";
import type { HudAddressSegment } from "_components/hud/hud.types.mts";
import type {
  AnkiDeck,
  AnkiDeckParts,
} from "_config/collect/collect.types.mts";
import { ANKI_DECK_SEPARATOR } from "_config/config.constants.mts";
import type {
  RankiAddressTokens,
  RankiBaseAddressMutation,
  RankiBaseAddressMutationMode,
} from "_config/config.types.mts";
import { assertNever } from "_error/assertions.mts";
import { RankiAppError } from "_error/ranki-app-error.mts";
import { MUTATION_MODE_PRECEDENCE } from "./app.mts";

function translateMarker(parts: AnkiDeckParts, marker: string | number) {
  let si: number;
  switch (typeof marker) {
    case "number":
      si = marker < 0 ? parts.length + marker + 1 : marker;
      if (si >= parts.length + 1) {
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

function alt(
  partMode: RankiBaseAddressMutationMode[],
  tokens: RankiAddressTokens,
  parts: AnkiDeckParts,
) {
  type HudAddressSegmentWorking = Pick<HudAddressSegment, "type" | "mode"> & {
    shown: string;
    masked: string;
  };
  const working: HudAddressSegmentWorking[] = [];

  parts.forEach((part, i) => {
    const mode = partMode[i];
    const type = ["trim", "hide", "separator"].includes(mode)
      ? ("divider" as "divider")
      : ("segment" as "segment");
    working.push({
      type,
      mode,
      masked: mode === "trim" ? tokens[mode] : part,
      shown: mode !== "show" ? tokens[mode] : part,
    });
  });

  const noSep: HudAddressSegment[] = [];
  working.forEach((w) => {
    const prev = noSep.at(-1);
    const hasPrev = !!prev;
    const isCombine =
      hasPrev && ["hide", "trim"].includes(w.mode) && prev.mode === w.mode;
    if (isCombine) {
      prev.masked.push(w.masked);
    } else if (w.mode !== "drop") {
      noSep.push({
        ...w,
        masked: [w.masked],
        shown: [w.shown],
      });
    }
  });

  const address: HudAddressSegment[] = [];
  noSep.forEach((w) => {
    const prev = address.at(-1);
    const hasPrev = !!prev;
    if (hasPrev && w.type === "segment" && prev.type === "segment") {
      address.push({
        type: "divider",
        mode: "separator",
        shown: [tokens.separator],
        masked: [tokens.separator],
      });
    }
    address.push(w);
  });

  return address;
}

export function buildAddressSegments(
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

  return alt(partMode, tokens, parts);

  // const address: HudAddressSegment_OLD[] = [];
  // partLoop: for (let [i, c] of partMode.entries()) {
  //   const prev = address.at(-1);

  //   const type = ["trim", "hide", "separator"].includes(c)
  //     ? ("divider" as "divider")
  //     : ("segment" as "segment");
  //   for (let m of ["hide", "trim"] as HudAddressSegmentPart["mode"][]) {
  //     if (prev?.mode === m && c === m) {
  //       (prev as HudAddressSegmentWithParts).parts.push({
  //         mode: m,
  //         shown: tokens[m],
  //         masked: parts[i],
  //       });
  //       continue partLoop;
  //     }
  //   }

  //   if (prev?.mode === "show" && c === "show") {
  //     address.push({
  //       type,
  //       mode: "separator",
  //       shown: [tokens.separator],
  //     });
  //   }

  //   switch (c) {
  //     case "trim":
  //     case "hide":
  //       if (prev && ["trim", "hide"].includes(prev.mode)) {
  //         prev.shown.push(tokens[c]);
  //         (prev as HudAddressSegmentWithParts).parts.push({
  //           mode: c,
  //           shown: tokens[c],
  //           masked: parts[i],
  //         });
  //       } else {
  //         const item = {
  //           type,
  //           mode: c,
  //           shown: [tokens[c]],
  //         };
  //         address.push({
  //           ...item,
  //           type: "divider",
  //           parts: [
  //             {
  //               mode: c,
  //               shown: tokens[c],
  //               masked: parts[i],
  //             },
  //           ],
  //         });
  //       }
  //       break;
  //     // @ts-expect-error
  //     case "drop":
  //       break;
  //     default:
  //       address.push({
  //         type,
  //         mode: c,
  //         shown: [parts[i]],
  //       });
  //   }
  // }

  // return address;
}
