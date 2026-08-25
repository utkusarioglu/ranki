import { RANKI_INTERNAL_FACE_PREFIX } from "_config/config.constants.mjs";
import type { DeckSettings } from "_config/config.types.mjs";

export const CARDS: DeckSettings[] = [
  {
    exact: "AB",
    config: {
      faces: {
        Q: ["A"],
        N: ["A", `${RANKI_INTERNAL_FACE_PREFIX}:rule`, "B"],
      },
    },
  },
  {
    exact: "BA",
    config: {
      faces: {
        Q: ["B"],
        N: ["B", `${RANKI_INTERNAL_FACE_PREFIX}:rule`, "A"],
      },
    },
  },
];
