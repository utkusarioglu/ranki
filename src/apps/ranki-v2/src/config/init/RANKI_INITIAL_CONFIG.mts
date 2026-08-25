import type { RankiChannelsConfig } from "_config/config.types.mjs";
import { FLAGS } from "./FLAGS.mjs";
import { TAGS } from "./TAGS.mjs";
import { BASE } from "./base/BASE.mjs";
import { CARDS } from "./CARDS.mjs";

export const RANKI_INITIAL_CONFIG: RankiChannelsConfig = {
  base: BASE,
  decks: [],
  types: [],
  faces: [],
  cards: CARDS,
  webview: [],
  tags: TAGS,
  always: [],
  flags: FLAGS,
};
