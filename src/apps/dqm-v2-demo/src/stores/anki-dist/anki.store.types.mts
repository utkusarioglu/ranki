export type AnkiDistStore = AnkiDistStoreStates & AnkiDistStoreActions;
export type ColorSchemes = "dark" | "light";

export interface AnkiDistStoreStates {
  previewAspect: number;
  previewScale: number;
  colorScheme: ColorSchemes;
}

export interface AnkiDistStoreActions {
  setPreviewScale: (n: number) => void;
  setPreviewAspect: (n: number) => void;
  setColorScheme: (s: ColorSchemes) => void;
}
