type Percent = number;

type TemplateDrawerModeType = "arrangement" | "single";

export type TemplateDrawerModeOpen = {
  type: TemplateDrawerModeType;
  index: number;
};

type TemplateDrawerMode = null | TemplateDrawerModeOpen;

export type UiStore = UiStoreStates & UiStoreActions;

export type AppState = "init" | "loading" | "loaded" | "error" | "timeout";

export interface UiStoreStates {
  appState: AppState;
  isNarrow: boolean;
  isMenuOpen: boolean;
  templateDrawerState: TemplateDrawerMode;
  menuWidth: Percent;
}

export interface UiStoreActions {
  setMenuOpen: (open: boolean) => void;
  setMenuWidth: (width: Percent) => void;
  setTemplateDrawerState: (mode: TemplateDrawerMode) => void;
  setAppState: (state: AppState) => void;
}
