import type { DeckSettings } from "_config/config.types.mjs";

import { RANKI_INTERNAL_FACE_PREFIX } from "_config/config.constants.mjs";

export const CARDS: DeckSettings[] = [
  {
    config: {
      faces: {
        N: ["A", `${RANKI_INTERNAL_FACE_PREFIX}:rule`, "B"],
        Q: ["A"],
      },
    },
    exact: "AB",
  },
  {
    config: {
      faces: {
        N: ["B", `${RANKI_INTERNAL_FACE_PREFIX}:rule`, "A"],
        Q: ["B"],
      },
    },
    exact: "BA",
  },
];
