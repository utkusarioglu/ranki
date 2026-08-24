import type { RawFields } from "_collect/collect.types.mjs";
import type {
  RankiCollectedConfig,
  RankiState,
} from "_config/config.types.mjs";

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
