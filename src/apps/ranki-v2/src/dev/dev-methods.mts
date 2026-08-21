import nativeHtml from "./native.html?raw";
import { assertNotUndefined, assertNotNull } from "_error/assertions.mjs";
import type {
  RankiPlayFields,
  RankiSetFunc,
  RankiSetValues,
} from "./dev.types.mjs";
import {
  CONFIG_TYPE_CLASS_SELECTOR,
  DATA_TYPE_CLASS_SELECTOR,
  INPUT_TYPE_CLASS_SELECTOR,
  RENDERED_CLASS_SELECTOR,
} from "../selector.constants.mjs";
import { RankiO11y } from "_/o11y/o11y.mjs";

export class RankiDevMethods {
  static isPersisted = false;

  static readonly o11y = RankiO11y.getConsoleAccess();

  static foreign(isForeign: boolean = true) {
    const qa = document.querySelector("#qa") as HTMLDivElement;
    assertNotUndefined(qa, { why: "needed" });
    if (isForeign === true) {
      qa.innerText = "Foreign Content";
    } else {
      qa.innerHTML = nativeHtml;
    }
  }

  static trigger() {
    const qa = document.querySelector("#qa") as HTMLDivElement;
    assertNotUndefined(qa, { why: "needed" });
    const ren = qa.querySelector(RENDERED_CLASS_SELECTOR);
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
    this.assign([DATA_TYPE_CLASS_SELECTOR, "face"].join("."), v);
  static deck = (v: RankiSetValues) =>
    this.assign([DATA_TYPE_CLASS_SELECTOR, "deck"].join("."), v);
  static tags = (v: RankiSetValues) =>
    this.assign([DATA_TYPE_CLASS_SELECTOR, "tags"].join("."), v);
  static type = (v: RankiSetValues) =>
    this.assign([DATA_TYPE_CLASS_SELECTOR, "type"].join("."), v);
  // TODO maybe allow color names
  static flag = (v: RankiSetValues) =>
    this.assign([DATA_TYPE_CLASS_SELECTOR, "flag"].join("."), "flag" + v);
  static card = (v: RankiSetValues) =>
    this.assign([DATA_TYPE_CLASS_SELECTOR, "card"].join("."), v);

  static a = (v: RankiSetValues) =>
    this.assign(
      [INPUT_TYPE_CLASS_SELECTOR, "A"].join("."),

      v,
    );
  static b = (v: RankiSetValues) =>
    this.assign([INPUT_TYPE_CLASS_SELECTOR, "B"].join("."), v);
  static c = (v: RankiSetValues) =>
    this.assign([INPUT_TYPE_CLASS_SELECTOR, "C"].join("."), v);
  static d = (v: RankiSetValues) =>
    this.assign([INPUT_TYPE_CLASS_SELECTOR, "D"].join("."), v);
  static e = (v: RankiSetValues) =>
    this.assign([INPUT_TYPE_CLASS_SELECTOR, "E"].join("."), v);

  static templateConfig = (v: object) =>
    this.assign(
      [CONFIG_TYPE_CLASS_SELECTOR, "template"].join("."),
      JSON.stringify(v),
    );
  static cardConfig = (v: object) =>
    this.assign(
      [CONFIG_TYPE_CLASS_SELECTOR, "card"].join("."),
      JSON.stringify(v),
    );

  static persist(on: boolean = true) {
    if (on) {
      console.log("Ranki DevMethods will persist until reload");
    } else {
      console.log("Ranki DevMethods will not persist on state change");
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
    opts?: { count?: number; duration?: number; delay?: number },
  ) {
    window.addEventListener("ranki-fault", (e) => {
      faultFound = true;
      console.log(e);
    });
    let faultFound = false;
    let index = 0;
    const count = opts?.count || 4;
    const duration = opts?.duration || 2e3;
    const delay = opts?.delay || 0;
    let interval: ReturnType<typeof setInterval>;

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
        console.log("index:", index);
        const props = Object.fromEntries(
          Object.entries(p).map(([k, v]) => [k, v[index % v.length]]),
        ) as RankiSetFunc;
        this.set(props);
        index++;
        if (index > count) {
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
