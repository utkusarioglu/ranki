import { create } from "zustand";
import type {
  AnkiDistStore,
  AnkiDistStoreStates,
} from "./anki.store.types.mts";

export const createAnkiStore = (defaults: AnkiDistStoreStates) =>
  create<AnkiDistStore>((set) => ({
    ...defaults,

    setColorScheme: (c) => set(() => ({ colorScheme: c })),
    setPreviewAspect: (n) => set(() => ({ previewAspect: n })),
    setPreviewScale: (n: number) =>
      set(() => ({
        previewScale: n,
      })),
    setCardConfig: (c) => set(() => ({ cardConfig: c })),
    setTemplateConfig: (c) => set(() => ({ templateConfig: c })),
  }));
