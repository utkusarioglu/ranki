import { appStore } from "./app/app.store.mjs";
import {
  notificationStore,
  type NotificationStore,
} from "./notifications/notifications.mjs";

export const store = {
  pushNotification: (...all: Parameters<NotificationStore["addList"]>) =>
    notificationStore.getState().addList(...all),
  use: {
    app: appStore,
    notification: notificationStore,
  },
};

export { getAnimationCollection } from "./app/app.getters.mjs";
