import { createStore } from "zustand/vanilla";

export interface NotificationEntry {
  color?: string;
  icon?: string;
  log: string;
}

export type NotificationStore = NotificationStoreMethods &
  NotificationStoreState;

type ListEntry = NotificationEntry;

interface NotificationStoreMethods {
  addList: (e: NotificationEntry) => void;
}

interface NotificationStoreState {
  list: ListEntry[];
}

export const notificationStore = createStore<NotificationStore>((set) => ({
  addList: (e) =>
    set((s) => ({
      list: [
        ...s.list,
        {
          epoch: Date.now(),
          ...e,
        },
      ],
    })),
  list: [],
}));
