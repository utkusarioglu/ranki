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
