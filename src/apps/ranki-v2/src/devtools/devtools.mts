import type { RankiDevState } from "_config/config.types.mjs";

import { RankiO11y } from "_/o11y/o11y.mjs";
import { store } from "_store/store.mjs";

import "./devtools.types.mjs";
import { RankiDevAnkiMethods } from "./anki.mjs";

export class RankiDevtools {
  static isPersisted = false;

  static persist(on: boolean = true) {
    if (on) {
      store.pushNotification({
        group: "devtools-persist",
        icon: "boxicons:alert-triangle",
        log: "Ranki DevMethods will persist until reload",
      });
    } else {
      store.pushNotification({
        group: "devtools-persist",
        icon: "boxicons:alarm-plus",
        log: "Ranki DevMethods will not persist on state change",
      });
    }
    this.isPersisted = on;
  }

  public static update(conf?: RankiDevState) {
    if (conf?.persist) {
      RankiDevtools.persist();
    }
    if (conf?.methods) {
      store.pushNotification({
        group: "devtools-methods",
        icon: "boxicons:air-conditioner-filled",
        log: "Ranki Devtools available at [code|window.ranki]",
      });

      window.ranki = {
        anki: RankiDevAnkiMethods,
        o11y: RankiO11y.getConsoleAccess(),
        store,
      };
    } else if (window.ranki) {
      if (!RankiDevtools.isPersisted) {
        store.removeNotification({
          groups: ["devtools-persist", "devtools-methods"],
        });
        console.log("Ranki Devtools removed.");
        delete window.ranki;
      }
    }
  }
}
