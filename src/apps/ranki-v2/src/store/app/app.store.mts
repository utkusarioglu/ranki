import { subscribeWithSelector } from "zustand/middleware";
import { createStore } from "zustand/vanilla";

import type { AnkiStore } from "./app.types.mjs";

export const appStore = createStore(
  subscribeWithSelector<AnkiStore>((set) => ({
    config: null,
    epoch: 0,
    raw: null,
    setEpoch: (epoch) => set({ epoch }),
    setMode: (shouldRender) => set({ shouldRender }),
    setRaw: (collected) => set({ raw: collected }),
    shouldRender: "stop",
    state: null,
  })),
);
