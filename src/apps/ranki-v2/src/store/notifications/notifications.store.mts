import { subscribeWithSelector } from "zustand/middleware";
import { createStore } from "zustand/vanilla";

import type { NotificationStore } from "./notifications.types.mjs";

export const notificationStore = createStore(
  subscribeWithSelector<NotificationStore>((set) => ({
    add: (e) =>
      set((s) => ({
        list: [
          ...s.list.filter((v) => v.group !== e.group),
          {
            epoch: Date.now(),
            group: e.group,
            record: {
              icon: e.icon
                ? {
                    id: e.icon,
                  }
                : undefined,
              // background: e.background
              //   ? {
              //       color: e.background,
              //     }
              //   : undefined,
              issuer: "notification",
              type: "notification",
            },
          },
        ],
      })),
    list: [],
    remove: (e) =>
      set((s) => ({
        list: s.list.filter((v) => !e.groups.includes(v.group)),
      })),
  })),
);
