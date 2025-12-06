import { create } from "zustand";

type Percent = number;

type TemplateDrawerModeType = "arrangement" | "single";

export type TemplateDrawerModeOpen = {
  type: TemplateDrawerModeType;
  index: number;
};

type TemplateDrawerMode = null | TemplateDrawerModeOpen;

interface UiStore {
  isNarrow: boolean;
  isMenuOpen: boolean;
  templateDrawerState: TemplateDrawerMode;
  menuWidth: Percent;
  setMenuOpen: (open: boolean) => void;
  setMenuWidth: (width: Percent) => void;
  setTemplateDrawerState: (mode: TemplateDrawerMode) => void;
}

const NARROW_THRESHOLD = 800;

const media = window.matchMedia("(max-width: 800px");
media.addEventListener("change", (e) => {
  useUiStore.setState(() => ({ isNarrow: e.matches }));
});

export const useUiStore = create<UiStore>((set) => ({
  templateDrawerState: null,
  isNarrow: window.innerWidth < NARROW_THRESHOLD,
  isMenuOpen: window.innerWidth > NARROW_THRESHOLD,
  menuWidth:
    window.innerWidth > NARROW_THRESHOLD
      ? window.innerWidth * 0.25
      : window.innerWidth,
  setMenuWidth: (menuWidth) => set(() => ({ menuWidth })),
  setMenuOpen: (open: boolean) =>
    set(() => ({
      isMenuOpen: open,
    })),
  setTemplateDrawerState: (state) =>
    set(() => ({ templateDrawerState: state })),
}));
