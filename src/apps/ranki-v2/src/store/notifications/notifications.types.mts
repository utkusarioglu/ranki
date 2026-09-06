import type { CueRecord } from "_config/config.types.mjs";

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

export type NotificationListEntry = {
  epoch: number;
  group: Group;
  record: CueRecord;
};

interface NotificationStoreMethods {
  add: (e: NotificationEntry) => void;
  remove: (e: NotificationRemoval) => void;
}

interface NotificationStoreState {
  list: NotificationListEntry[];
}
