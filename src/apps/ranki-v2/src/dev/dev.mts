import type { RankiDevState } from "../config/config.types.mts";
import { RankiDevMethods } from "./dev-methods.mts";

export function createDevTools(conf: RankiDevState) {
  if (conf.methods) {
    console.log(
      "Ranki DevMethods available at %cwindow.ranki",
      "background:#000;color:#df981d;padding:2px 6px;",
    );

    window.ranki = RankiDevMethods;
  } else if (window.ranki) {
    console.log("Ranki DevMethods removed.");
    delete window.ranki;
  }
}
