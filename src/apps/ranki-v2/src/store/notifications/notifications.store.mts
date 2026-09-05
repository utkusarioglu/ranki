import { createStore } from "zustand/vanilla";
import type { NotificationStore } from "./notifications.types.mjs";

export const notificationStore = createStore<NotificationStore>((set) => ({
  remove: (e) =>
    set((s) => ({
      list: s.list.filter((v) => !e.groups.includes(v.group)),
    })),
  add: (e) =>
    set((s) => ({
      list: [
        ...s.list.filter((v) => v.group !== e.group),
        {
          epoch: Date.now(),
          ...e,
        },
      ],
    })),
  list: [],
}));

notificationStore.subscribe((s) => console.log(s.list));
