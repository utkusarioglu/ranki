type Percent = number;

type TemplateDrawerModeType = "arrangement" | "single";

export type MenuDrawerModeOpen = TemplateDrawerModeOpen | GraphDrawerModeOpen;
type TemplateDrawerModeOpen = {
  type: TemplateDrawerModeType;
  index: number;
};

type GraphDrawerModeOpen = {
  type: "graph";
  data: {
    type: "string";
    data: any;
  };
};

type TemplateDrawerMode = null | MenuDrawerModeOpen;

export type UiStore = UiStoreStates & UiStoreActions;

export type AppState = "init" | "loading" | "loaded" | "error" | "timeout";

export type NumberTuple = [number, number];

export interface UiStoreStates {
  appState: AppState;
  isNarrow: boolean;
  isMenuOpen: boolean;
  templateDrawerState: TemplateDrawerMode;
  menuWidth: Percent;

  previewSize: NumberTuple;
  previewScale: number;
}

export interface UiStoreActions {
  setMenuOpen: (open: boolean) => void;
  setMenuWidth: (width: Percent) => void;
  setTemplateDrawerState: (mode: TemplateDrawerMode) => void;
  setAppState: (state: AppState) => void;
  setPreviewSize: (n: NumberTuple) => void;
  setPreviewScale: (n: number) => void;
}
