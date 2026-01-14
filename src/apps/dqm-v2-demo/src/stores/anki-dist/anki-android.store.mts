import { create } from "zustand";
import type { AnkiDistStore } from "./anki.store.types.mts";

export const useAnkiAndroidStore = create<AnkiDistStore>((set) => ({
  previewScale: 1,
  previewAspect: 9 / 19,
  colorScheme: "dark",

  setColorScheme: (c) => set(() => ({ colorScheme: c })),
  setPreviewAspect: (n) => set(() => ({ previewAspect: n })),
  setPreviewScale: (n: number) =>
    set(() => ({
      previewScale: n,
    })),
}));
