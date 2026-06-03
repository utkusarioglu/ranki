import type { RankiDevState } from "_config/config.types.mjs";
import { RankiDevMethods } from "./dev-methods.mjs";

export function createDevTools(conf: RankiDevState) {
  if (conf.persist) {
    RankiDevMethods.persist();
  }
  if (conf.methods) {
    console.log(
      "Ranki DevMethods available at %cwindow.ranki",
      "background:#000;color:#df981d;padding:2px 6px;",
    );

    window.ranki = RankiDevMethods;
  } else if (window.ranki) {
    if (!RankiDevMethods.isPersisted) {
      console.log("Ranki DevMethods removed.");
      delete window.ranki;
    }
  }
}
