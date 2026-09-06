export interface NotificationEntry {
  background?: string;
  color?: string;
  group: Group;
  icon?: string;
  log: string;
}

export interface NotificationRemoval {
  groups: Group[];
}

export type NotificationStore = NotificationStoreMethods &
  NotificationStoreState;

type Group = { type?: "NotificationGroup" } & string;

export type NotificationListEntry = NotificationEntry;

interface NotificationStoreMethods {
  add: (e: NotificationEntry) => void;
  remove: (e: NotificationRemoval) => void;
}

interface NotificationStoreState {
  list: NotificationListEntry[];
}
