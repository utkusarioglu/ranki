import { appStore } from "./app/app.store.mjs";
import {
  notificationStore,
  type NotificationStore,
} from "./notifications/notifications.mjs";

export const store = {
  pushNotification: (...all: Parameters<NotificationStore["add"]>) =>
    notificationStore.getState().add(...all),
  removeNotification: (...all: Parameters<NotificationStore["remove"]>) =>
    notificationStore.getState().remove(...all),
  use: {
    app: appStore,
    notification: notificationStore,
  },
};

export { getAnimationCollection } from "./app/app.getters.mjs";
