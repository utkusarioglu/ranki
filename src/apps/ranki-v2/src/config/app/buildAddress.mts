import type { AnkiDeck, AnkiDeckParts } from "_collect/collect.types.mjs";
import type { HudAddressSegment } from "_components/hud/hud.types.mjs";
import type {
  RankiAddressTokens,
  RankiBaseAddressMutation,
  RankiBaseAddressMutationMode,
} from "_config/config.types.mjs";

import { ANKI_DECK_SEPARATOR } from "_config/config.constants.mjs";
import { assertNever } from "_error/assertions.mjs";
import { RankiAppError } from "_error/ranki-app-error.mjs";
import { assertExists } from "@dqm/package-dqm-utils";

import { MUTATION_MODE_PRECEDENCE } from "./app.mjs";

export function buildAddressSegments(
  tokens: RankiAddressTokens,
  mutations: RankiBaseAddressMutation[],
  deck: AnkiDeck,
): HudAddressSegment[] {
  const parts = deck.split(ANKI_DECK_SEPARATOR) as AnkiDeckParts;
  const partMode: RankiBaseAddressMutationMode[] = Array(parts.length).fill(
    "show",
  );
  mutations.forEach(({ end, mode, start }) => {
    const si = translateMarker(parts, start);
    const ei = translateMarker(parts, end);
    for (let pi = si; pi < ei; pi++) {
      const mi = MUTATION_MODE_PRECEDENCE.indexOf(mode);
      assertExists(mi, {
        details: { deck, end, mode, mutations, start },
        why: "Unrecognized option for address mode",
      });
      const ci = MUTATION_MODE_PRECEDENCE.indexOf(partMode[pi])!;
      if (ci > mi) {
        partMode[pi] = mode;
      }
    }
  });

  return alt(partMode, tokens, parts);
}

function alt(
  partMode: RankiBaseAddressMutationMode[],
  tokens: RankiAddressTokens,
  parts: AnkiDeckParts,
): HudAddressSegment[] {
  type HudAddressSegmentWorking = {
    masked: string;
    shown: string;
  } & Pick<HudAddressSegment, "mode" | "type">;
  type HudAddressSegmentWithoutPosition = Omit<HudAddressSegment, "position">;
  const working: HudAddressSegmentWorking[] = [];

  parts.forEach((part, i) => {
    const mode = partMode[i];
    const type = ["hide", "separator", "trim"].includes(mode)
      ? ("divider" as const)
      : ("segment" as const);
    working.push({
      masked: mode === "trim" ? tokens[mode] : part,
      mode,
      shown: mode !== "show" ? tokens[mode] : part,
      type,
    });
  });

  const noSep: HudAddressSegmentWithoutPosition[] = [];
  working.forEach((w) => {
    const prev = noSep.at(-1);
    const hasPrev = !!prev;
    const isCombine =
      hasPrev && ["hide", "trim"].includes(w.mode) && prev.mode === w.mode;
    if (isCombine) {
      prev.masked.push(w.masked);
    } else if (w.mode !== "drop") {
      // @ts-expect-error
      // FIX
      noSep.push({
        ...w,
        masked: [w.masked],
        shown: [w.shown],
      });
    }
  });

  const wPos: HudAddressSegmentWithoutPosition[] = [];
  noSep.forEach((w) => {
    const prev = wPos.at(-1);
    const hasPrev = !!prev;
    if (hasPrev && w.type === "segment" && prev.type === "segment") {
      // @ts-expect-error
      // FIX
      wPos.push({
        masked: [tokens.separator],
        mode: "separator",
        shown: [tokens.separator],
        type: "divider",
      });
    }
    wPos.push(w);
  });

  const address: HudAddressSegment[] = [];
  for (let i = 0; i < wPos.length; i++) {
    let left: HudAddressSegment["position"]["left"] = "middle";
    let right: HudAddressSegment["position"]["right"] = "middle";

    if (wPos[i].type === "divider") {
      if (i === 0) {
        left = "first";
      } else if (i > 0 && wPos[i - 1].type !== "divider") {
        left = "local-first";
      }
      if (i === wPos.length - 1) {
        right = "last";
      } else if (i < wPos.length - 1 && wPos[i + 1].type !== "divider") {
        right = "local-last";
      }
    }

    address.push({
      ...wPos[i],
      position: {
        left,
        right,
      },
    });
  }

  return address;
}

function translateMarker(parts: AnkiDeckParts, marker: number | string) {
  let si: number;
  switch (typeof marker) {
    case "number":
      si = marker < 0 ? parts.length + marker + 1 : marker;
      if (si >= parts.length + 1) {
        throw new RankiAppError({
          cause: null,
          code: "INDEX_ERROR",
          details: { marker, parts, si },
          why: "marker points to an out of bound index",
        });
      }
      return si;

    case "string":
      si = parts.indexOf(marker as AnkiDeck);
      if (si === -1) {
        throw new RankiAppError({
          cause: null,
          code: "INDEX_ERROR",
          details: { marker, parts, si },
          why: "marker string did not translate to an index",
        });
      }
      break;

    default:
      assertNever({
        details: { marker, parts },
        why: "Address marker has to be either a string or a number",
      });
  }
  return si;
}
