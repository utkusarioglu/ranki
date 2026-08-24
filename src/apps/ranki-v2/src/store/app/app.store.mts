import { createStore } from "zustand/vanilla";
import { subscribeWithSelector } from "zustand/middleware";
import type { AnkiStore } from "./app.types.mjs";

export const appStore = createStore(
  subscribeWithSelector<AnkiStore>((set) => ({
    epoch: 0,
    shouldRender: "stop",
    raw: null,
    config: null,
    state: null,
    setMode: (shouldRender) => set({ shouldRender }),
    setEpoch: (epoch) => set({ epoch }),
    setRaw: (collected) => set({ raw: collected }),
  })),
);
