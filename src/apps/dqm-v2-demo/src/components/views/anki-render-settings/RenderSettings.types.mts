import type {
  AnkiDistStore,
  ColorSchemes,
  RankiFlag,
} from "_stores/anki-dist/anki.store.types.mjs";

export interface AnkiRenderSettingsProps {
  aspectRatios: string[];
  colorSchemes: ColorSchemes[];
  scales: string[];
  store: AnkiDistStore;
}

export interface Flag {
  color: "none" | `#${string}`;
  flag: RankiFlag;
}

export interface TelemetryOverrideProps {
  store: AnkiDistStore;
}
