import { create } from "zustand";
import type { AnkiDistStore } from "./anki.store.types.mts";

export const useAnkiWinStore = create<AnkiDistStore>((set) => ({
  previewScale: 1.25,
  previewAspect: 16 / 9,
  colorScheme: "dark",

  setColorScheme: (c) => set(() => ({ colorScheme: c })),
  setPreviewAspect: (n) => set(() => ({ previewAspect: n })),
  setPreviewScale: (n: number) =>
    set(() => ({
      previewScale: n,
    })),
}));
