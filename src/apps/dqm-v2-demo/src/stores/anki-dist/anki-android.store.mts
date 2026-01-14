import { createAnkiStore } from "./anki.store.builder.mts";

export const useAnkiAndroidStore = createAnkiStore({
  previewScale: 1,
  previewAspect: 9 / 19,
  colorScheme: "dark",
  cardConfig: "",
  templateConfig: "",
  deck: "Tests::Test",
  tags: "",
});
