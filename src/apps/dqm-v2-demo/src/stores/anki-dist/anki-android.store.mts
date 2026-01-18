import { createAnkiStore } from "./anki.store.builder.mts";
import { CARD_CONFIG, TEMPLATE_CONFIG } from "./constants.common.mts";

export const useAnkiAndroidStore = createAnkiStore({
  previewScale: 1,
  previewAspect: 9 / 19,
  colorScheme: "dark",
  cardConfig: CARD_CONFIG,
  templateConfig: TEMPLATE_CONFIG,
  deck: "Tests::Test",
  tags: "",
  face: "Q",
  flag: "flag0",
  cardType: "+r:AB:BA",
  card: "AB",
});
