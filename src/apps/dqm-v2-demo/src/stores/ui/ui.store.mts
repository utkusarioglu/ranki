import { create } from "zustand";

import type { AppState, UiStore } from "./ui.store.types.mts";

import {
  NARROW_LAYOUT_THRESHOLD,
  WIDE_LAYOUT_LEFT_MENU_WIDTH_MIN,
  WIDE_LAYOUT_LEFT_MENU_WIDTH_RATIO,
} from "./ui.store.constants.mts";

/**
 * TODO This doesn't belong here
 */
const media = window.matchMedia("(max-width: 800px");
media.addEventListener("change", (e) => {
  useUiStore.setState(() => ({ isNarrow: e.matches }));
});

export const useUiStore = create<UiStore>((set) => ({
  appState: "init",
  isMenuOpen: window.innerWidth > NARROW_LAYOUT_THRESHOLD,
  isNarrow: window.innerWidth < NARROW_LAYOUT_THRESHOLD,
  menuWidth:
    window.innerWidth > NARROW_LAYOUT_THRESHOLD
      ? Math.max(
          window.innerWidth * WIDE_LAYOUT_LEFT_MENU_WIDTH_RATIO,
          WIDE_LAYOUT_LEFT_MENU_WIDTH_MIN,
        )
      : window.innerWidth,
  setAppState: (state: AppState) => set(() => ({ appState: state })),

  setMenuOpen: (open: boolean) =>
    set(() => ({
      isMenuOpen: open,
    })),
  setMenuWidth: (menuWidth) => set(() => ({ menuWidth })),
  setTemplateDrawerState: (state) =>
    set(() => ({ templateDrawerState: state })),
  templateDrawerState: null,
}));
