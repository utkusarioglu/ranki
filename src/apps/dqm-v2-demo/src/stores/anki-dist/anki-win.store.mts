import { createAnkiStore } from "./anki.store.builder.mts";
import { CARD_CONFIG, DECK, TEMPLATE_CONFIG } from "./constants.common.mts";

export const useAnkiWinStore = createAnkiStore({
  contentType: "r2",
  previewScale: 1.25,
  previewAspect: 16 / 9,
  colorScheme: "dark",
  cardConfig: CARD_CONFIG,
  templateConfig: TEMPLATE_CONFIG,
  deck: DECK,
  tags: "",
  face: "Q",
  flag: "flag0",
  cardType: "+r:AB:BA",
  card: "AB",
});
