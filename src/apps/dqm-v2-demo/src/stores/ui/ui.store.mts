import { create } from "zustand";

type Percent = string;

interface UiStore {
  isNarrow: boolean;
  isMenuOpen: boolean;
  menuWidth: Percent; // percent
  setMenuOpen: (open: boolean) => void;
  // openMenu: () => void;
  // closeMenu: () => void;
  setMenuWidth: (width: Percent) => void;
}

const NARROW_THRESHOLD = 800;

const media = window.matchMedia("(max-width: 800px");
media.addEventListener("change", (e) => {
  useUiStore.setState(() => ({ isNarrow: e.matches }));
});

export const useUiStore = create<UiStore>((set) => ({
  isNarrow: window.innerWidth < NARROW_THRESHOLD,
  isMenuOpen: window.innerWidth > NARROW_THRESHOLD,
  menuWidth: "25%",
  setMenuWidth: (menuWidth) => set(() => ({ menuWidth })),
  setMenuOpen: (open: boolean) =>
    set(() => ({
      isMenuOpen: open,
    })),
  // closeMenu: () =>
  //   set(() => ({
  //     isMenuOpen: false,
  //   })),
}));
