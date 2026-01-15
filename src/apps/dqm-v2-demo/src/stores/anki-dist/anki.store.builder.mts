import { create } from "zustand";
import type {
  AnkiDistStore,
  AnkiDistStoreStates,
} from "./anki.store.types.mts";

export const createAnkiStore = (defaults: AnkiDistStoreStates) =>
  create<AnkiDistStore>((set) => ({
    ...defaults,

    setColorScheme: (colorScheme) => set(() => ({ colorScheme })),
    setPreviewAspect: (previewAspect) => set(() => ({ previewAspect })),
    setPreviewScale: (previewScale) => set(() => ({ previewScale })),
    setCardConfig: (cardConfig) => set(() => ({ cardConfig })),
    setTemplateConfig: (templateConfig) => set(() => ({ templateConfig })),
    setTags: (tags) => set(() => ({ tags })),
    setDeck: (deck) => set(() => ({ deck: deck.trim() })),
    setFlag: (flag) => set(() => ({ flag })),
    setFace: (face) => set(() => ({ face })),
    setCardType: (cardType) => set(() => ({ cardType })),
    setCard: (card) => set(() => ({ card })),
  }));
