import type { RankiDevState } from "_config/config.types.mjs";

import { RankiO11y } from "_/o11y/o11y.mjs";
import { appStore } from "_store/app/app.store.mjs";

import "./devtools.types.mjs";
import { RankiDevAnkiMethods } from "./anki.mjs";

export class RankiDevtools {
  static isPersisted = false;

  static persist(on: boolean = true) {
    if (on) {
      console.log("Ranki DevMethods will persist until reload");
    } else {
      console.log("Ranki DevMethods will not persist on state change");
    }
    this.isPersisted = on;
  }

  public static update(conf?: RankiDevState) {
    if (conf?.persist) {
      RankiDevtools.persist();
    }
    if (conf?.methods) {
      console.log(
        "Ranki Devtools available at %cwindow.ranki",
        "background:#000;color:#df981d;padding:2px 6px;",
      );

      window.ranki = {
        anki: RankiDevAnkiMethods,
        o11y: RankiO11y.getConsoleAccess(),
        store: {
          app: appStore,
        },
      };
    } else if (window.ranki) {
      if (!RankiDevtools.isPersisted) {
        console.log("Ranki Devtools removed.");
        delete window.ranki;
      }
    }
  }
}
