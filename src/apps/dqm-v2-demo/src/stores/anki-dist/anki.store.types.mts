export type AnkiDistStore = AnkiDistStoreStates & AnkiDistStoreActions;
export type ColorSchemes = "dark" | "light";

export type RankiConfigString = string;

export interface AnkiDistStoreStates {
  previewAspect: number;
  previewScale: number;
  colorScheme: ColorSchemes;
  cardConfig: RankiConfigString;
  templateConfig: RankiConfigString;
}

export interface AnkiDistStoreActions {
  setPreviewScale: (n: number) => void;
  setPreviewAspect: (n: number) => void;
  setColorScheme: (s: ColorSchemes) => void;
  setCardConfig: (c: RankiConfigString) => void;
  setTemplateConfig: (c: RankiConfigString) => void;
}
