import { createAnkiStore } from "./anki.store.builder.mts";
import { CARD_CONFIG, DECK, TEMPLATE_CONFIG } from "./constants.common.mts";

export const useAnkiWinStore = createAnkiStore({
  appVariant: "devtools",
  card: "AB",
  cardConfig: CARD_CONFIG,
  cardType: "+r:AB:BA",
  colorScheme: "dark",
  contentType: "r2",
  deck: DECK,
  events: [],
  face: "Q",
  flag: "flag0",
  previewAspect: 16 / 9,
  previewScale: 1.25,
  tags: "win",
  templateConfig: TEMPLATE_CONFIG,
});
