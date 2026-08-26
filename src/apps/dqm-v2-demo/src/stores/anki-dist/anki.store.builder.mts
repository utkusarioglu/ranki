import { create } from "zustand";

import type {
  AnkiDistStore,
  AnkiDistStoreStates,
} from "./anki.store.types.mts";

export const createAnkiStore = (defaults: AnkiDistStoreStates) =>
  create<AnkiDistStore>((set) => ({
    ...defaults,

    setAppVariant: (appVariant) => set(() => ({ appVariant })),
    setCard: (card) => set(() => ({ card })),
    setCardConfig: (cardConfig) => set(() => ({ cardConfig })),
    setCardType: (cardType) => set(() => ({ cardType })),
    setColorScheme: (colorScheme) => set(() => ({ colorScheme })),
    setContentType: (contentType) => set(() => ({ contentType })),
    setDeck: (deck) => set(() => ({ deck: deck.trim() })),
    setFace: (face) => set(() => ({ face })),
    setFlag: (flag) => set(() => ({ flag })),
    setPreviewAspect: (previewAspect) => set(() => ({ previewAspect })),
    setPreviewScale: (previewScale) => set(() => ({ previewScale })),
    setTags: (tags) => set(() => ({ tags })),
    setTemplateConfig: (templateConfig) => set(() => ({ templateConfig })),
  }));
