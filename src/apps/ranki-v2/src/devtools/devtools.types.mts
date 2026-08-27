import type { RankiO11yConsoleAccess } from "_/o11y/o11y.types.mjs";

import type { IRankiDevAnkiMethods } from "./anki.types.mjs";
import type { appStore } from "_store/app/app.store.mjs";

declare global {
  interface Window {
    ranki?: {
      anki: IRankiDevAnkiMethods;
      o11y: RankiO11yConsoleAccess;
      store: {
        app: typeof appStore;
      };
    };
  }
}

export interface RankiDevtools {
  isPersisted: boolean;

  persist(on: boolean): void;
}
