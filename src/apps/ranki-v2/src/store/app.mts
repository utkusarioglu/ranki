import { onReady, shouldRender } from "_/bootstrap/startup.mjs";
import { collectRaw } from "_/collect/collect.mjs";
import type { RawFields } from "_/collect/collect.types.mjs";
import { createStore } from "zustand/vanilla";
import { subscribeWithSelector } from "zustand/middleware";
import type {
  RankiCollectedConfig,
  RankiState,
} from "_config/config.types.mjs";
import { collectConfig } from "_config/config.mjs";
import { createAppConfig } from "_config/app/app.mjs";
import { createDevTools } from "_/dev/dev.mjs";

interface AppState {
  epoch: number;
  shouldRender: "render" | "remove" | "stop";
  raw: null | RawFields;
  config: null | RankiCollectedConfig;
  state: null | RankiState;
}

interface AppMethods {
  setEpoch: (e: AppState["epoch"]) => void;
  setMode: (m: AppState["shouldRender"]) => void;
  setRaw: (c: NonNullable<AppState["raw"]>) => void;
}

export type AnkiStore = AppState & AppMethods;

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

appStore.subscribe(
  (s) => s.state,
  (state) => {
    if (state !== null) {
      createDevTools(state.dev);
    }
  },
);

appStore.subscribe(
  (s) => s.config,
  (config) => {
    const raw = appStore.getState().raw as RawFields;
    appStore.setState({
      state: config === null ? null : createAppConfig(config, raw),
    });
  },
);

appStore.subscribe(
  (s) => s.raw,
  () => {
    const raw = appStore.getState().raw;
    appStore.setState({ config: raw === null ? null : collectConfig(raw) });
  },
);

appStore.subscribe(
  (s) => s.epoch,
  async () => {
    const raw = await collectRaw();
    appStore.setState({ raw });
  },
);

onReady(() => {
  const should = shouldRender();
  appStore.setState({
    epoch: Date.now(),
    shouldRender: should,
  });
});
