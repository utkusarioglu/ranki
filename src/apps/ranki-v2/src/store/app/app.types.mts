import type { RawFields } from "_collect/collect.types.mjs";
import type {
  RankiCollectedConfig,
  RankiState,
} from "_config/config.types.mjs";

export type AnkiStore = AppMethods & AppState;

interface AppMethods {
  setEpoch: (e: AppState["epoch"]) => void;
  setMode: (m: AppState["shouldRender"]) => void;
  setRaw: (c: NonNullable<AppState["raw"]>) => void;
}

interface AppState {
  config: null | RankiCollectedConfig;
  epoch: number;
  raw: null | RawFields;
  shouldRender: "remove" | "render" | "stop";
  state: null | RankiState;
}
