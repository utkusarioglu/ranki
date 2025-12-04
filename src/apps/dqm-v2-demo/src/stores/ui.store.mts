import { create } from "zustand";

interface UiStore {
  isDrawerOpen: boolean;
  drawerWidth: number;
  openDrawer: () => void;
  closeDrawer: () => void;
  setDrawerWidth: (width: number) => void;
  // raw: string;
  // parsed: string;
  // setRaw: (raw: string) => void;
}

export const useUiStore = create<UiStore>((set) => ({
  isDrawerOpen: true,
  drawerWidth: 300,
  setDrawerWidth: (drawerWidth) => set(() => ({ drawerWidth })),
  openDrawer: () =>
    set(() => ({
      isDrawerOpen: true,
    })),
  closeDrawer: () =>
    set(() => ({
      isDrawerOpen: false,
    })),
}));
