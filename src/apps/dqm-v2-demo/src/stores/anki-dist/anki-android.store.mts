import { createAnkiStore } from "./anki.store.builder.mts";
import { CARD_CONFIG, DECK, TEMPLATE_CONFIG } from "./constants.common.mts";

export const useAnkiAndroidStore = createAnkiStore({
  appVariant: "devtools",
  card: "AB",
  cardConfig: CARD_CONFIG,
  cardType: "+r:AB:BA",
  colorScheme: "dark",
  contentType: "r2",
  deck: DECK,
  face: "Q",
  flag: "flag0",
  previewAspect: 9 / 19,
  previewScale: 1,
  tags: "android",
  templateConfig: TEMPLATE_CONFIG,
});
