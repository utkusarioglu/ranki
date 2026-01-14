// import { create } from "zustand";
// import type { AnkiDistStore } from "./anki.store.types.mts";
import { createAnkiStore } from "./anki.store.builder.mts";

export const useAnkiWinStore = createAnkiStore({
  previewScale: 1.25,
  previewAspect: 16 / 9,
  colorScheme: "dark",
  cardConfig: "",
  templateConfig: "",
  deck: "Tests::Test",
  tags: "",
});
