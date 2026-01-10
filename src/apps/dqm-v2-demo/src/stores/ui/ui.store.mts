import { create } from "zustand";
import type { AppState, NumberTuple, UiStore } from "./ui.store.types.mts";
import {
  NARROW_LAYOUT_THRESHOLD,
  WIDE_LAYOUT_LEFT_MENU_WIDTH_MIN,
  WIDE_LAYOUT_LEFT_MENU_WIDTH_RATIO,
} from "./ui.store.constants.mts";
import { getFitting } from "./utils.mts";

/**
 * TODO This doesn't belong here
 */
const media = window.matchMedia("(max-width: 800px");
media.addEventListener("change", (e) => {
  useUiStore.setState(() => ({ isNarrow: e.matches }));
});

export const useUiStore = create<UiStore>((set) => ({
  appState: "init",
  templateDrawerState: null,
  isNarrow: window.innerWidth < NARROW_LAYOUT_THRESHOLD,
  isMenuOpen: window.innerWidth > NARROW_LAYOUT_THRESHOLD,
  menuWidth:
    window.innerWidth > NARROW_LAYOUT_THRESHOLD
      ? Math.max(
          window.innerWidth * WIDE_LAYOUT_LEFT_MENU_WIDTH_RATIO,
          WIDE_LAYOUT_LEFT_MENU_WIDTH_MIN,
        )
      : window.innerWidth,
  previewSize: getFitting(9 / 16, 50),
  previewScale: 1,

  setMenuWidth: (menuWidth) => set(() => ({ menuWidth })),
  setMenuOpen: (open: boolean) =>
    set(() => ({
      isMenuOpen: open,
    })),
  setTemplateDrawerState: (state) =>
    set(() => ({ templateDrawerState: state })),
  setAppState: (state: AppState) => set(() => ({ appState: state })),

  setPreviewSize: (t: NumberTuple) => set(() => ({ previewSize: t })),
  setPreviewScale: (n: number) =>
    set(() => ({
      previewScale: n,
    })),
}));
