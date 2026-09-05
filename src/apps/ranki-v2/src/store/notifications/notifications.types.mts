export interface NotificationEntry {
  group: Group;
  color?: string;
  icon?: string;
  log: string;
}

type Group = string;

export interface NotificationRemoval {
  groups: Group[];
}

export type NotificationStore = NotificationStoreMethods &
  NotificationStoreState;

type ListEntry = NotificationEntry;

interface NotificationStoreMethods {
  add: (e: NotificationEntry) => void;
  remove: (e: NotificationRemoval) => void;
}

interface NotificationStoreState {
  list: ListEntry[];
}
