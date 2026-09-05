import { createStore } from "zustand/vanilla";
import type { NotificationStore } from "./notifications.types.mjs";

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
