import { assertNotUndefined, assertNotNull } from "../error/assertions.mts";
import type {
  RankiPlayFields,
  RankiSetFunc,
  RankiSetValues,
} from "./dev.types.mts";

export class RankiDevMethods {
  static isPersisted = false;

  static trigger() {
    const qa = document.querySelector("#qa") as HTMLDivElement;
    assertNotUndefined(qa, { why: "needed" });
    const ren = qa.querySelector("div.rendered");
    if (ren) {
      qa.removeChild(ren);
    }
    return qa;
  }

  private static assign(selector: string, value: RankiSetValues) {
    const qa = this.trigger();
    const elem = qa.querySelector(selector) as HTMLScriptElement;
    assertNotNull(elem, { why: "needed" });
    elem.innerText = value.toString();
  }

  static face = (v: RankiSetValues) =>
    this.assign("script.ranki-v2-data.face", v);
  static deck = (v: RankiSetValues) =>
    this.assign("script.ranki-v2-data.deck", v);
  static tags = (v: RankiSetValues) =>
    this.assign("script.ranki-v2-data.tags", v);
  static type = (v: RankiSetValues) =>
    this.assign("script.ranki-v2-data.type", v);
  // TODO maybe allow color names
  static flag = (v: RankiSetValues) =>
    this.assign("script.ranki-v2-data.flag", "flag" + v);
  static card = (v: RankiSetValues) =>
    this.assign("script.ranki-v2-data.card", v);

  static a = (v: RankiSetValues) => this.assign("script.ranki-v2-input.A", v);
  static b = (v: RankiSetValues) => this.assign("script.ranki-v2-input.B", v);
  static c = (v: RankiSetValues) => this.assign("script.ranki-v2-input.C", v);
  static d = (v: RankiSetValues) => this.assign("script.ranki-v2-input.D", v);
  static e = (v: RankiSetValues) => this.assign("script.ranki-v2-input.E", v);

  static templateConfig = (v: object) =>
    this.assign("script.ranki-v2-config.template", JSON.stringify(v));
  static cardConfig = (v: object) =>
    this.assign("script.ranki-v2-config.card", JSON.stringify(v));

  static persist(on: boolean = true) {
    if (on) {
      console.log("Ranki DevMethods will persist during current instance");
    } else {
      console.log("Ranki DevMethods will be removed if trigger is removed");
    }
    this.isPersisted = on;
  }

  static set(p: RankiSetFunc) {
    Object.entries(p).forEach(([k, v]) => {
      // @ts-expect-error
      this[k](v);
    });
  }

  static play(
    p: RankiPlayFields,
    opts?: { limit?: number; duration?: number; delay?: number },
  ) {
    window.addEventListener("ranki-fault", (e) => {
      faultFound = true;
      console.log(e);
    });
    let faultFound = false;
    let count = 0;
    const limit = opts?.limit || 4;
    const duration = opts?.duration || 2e3;
    const delay = opts?.delay || 0;
    let interval: number;

    if (delay > 0) {
      console.log(`alternate: starting in ${delay}msec`);
    }

    const cb = () => {
      if (faultFound) {
        clearInterval(interval);
        console.log("alternate: fault found");
        return;
      }
      try {
        console.log("alternate:", count);
        const props = Object.fromEntries(
          Object.entries(p).map(([k, v]) => [k, v[count % v.length]]),
        ) as RankiSetFunc;
        this.set(props);
        count++;
        if (count > limit) {
          clearInterval(interval);
          console.log("alternate: done");
        }
      } catch (e) {
        clearInterval(interval);
        console.log(e);
        console.log("alternate: failed");
      }
    };

    setTimeout(() => {
      cb();
      interval = setInterval(cb, duration);
    }, delay);
  }
}
