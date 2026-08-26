import type { RankiChannelsConfig } from "_config/config.types.mjs";

import { BASE } from "./base/BASE.mjs";
import { CARDS } from "./CARDS.mjs";
import { FLAGS } from "./FLAGS.mjs";
import { TAGS } from "./TAGS.mjs";

export const RANKI_INITIAL_CONFIG: RankiChannelsConfig = {
  always: [],
  base: BASE,
  cards: CARDS,
  decks: [],
  faces: [],
  flags: FLAGS,
  tags: TAGS,
  types: [],
  webview: [],
};
