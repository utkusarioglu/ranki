import type { AnkiFlagColors } from "_config/config.types.mjs";

import { FLAG_COLOR_ORDER } from "_/anki.constants.mjs";
import {
  assertNever,
  assertNotNull,
  assertNotUndefined,
} from "_error/assertions.mjs";

import type {
  AnkiPlayFields,
  AnkiRecordProps,
  AnkiSetFunc,
  AnkiSetValues,
} from "./anki.types.mjs";

import {
  CONFIG_TYPE_CLASS_SELECTOR,
  DATA_TYPE_CLASS_SELECTOR,
  INPUT_TYPE_CLASS_SELECTOR,
  RENDERED_CLASS_SELECTOR,
} from "../selector.constants.mjs";
import nativeHtml from "./native.html?raw";

export class RankiDevAnkiMethods {
  static card = (v: AnkiSetValues) => this.dataType("card", v);

  static config(v: AnkiRecordProps) {
    Object.entries(v).forEach(([type, value]) => {
      this.assign(
        [CONFIG_TYPE_CLASS_SELECTOR, type].join("."),
        JSON.stringify(value),
      );
    });
  }

  static deck = (v: AnkiSetValues) => this.dataType("deck", v);

  static face = (v: AnkiSetValues) => this.dataType("face", v);

  static flag(v: AnkiSetValues) {
    const index =
      typeof v === "string" ? FLAG_COLOR_ORDER.indexOf(v as AnkiFlagColors) : v;
    assertNotUndefined(index, {
      details: {
        FLAG_COLOR_ORDER,
        v,
      },
      why: "Unknown flag index",
    });
    this.dataType("flag", "flag" + index);
  }
  static foreign(isForeign: boolean = true) {
    const qa = document.querySelector("#qa") as HTMLDivElement;
    assertNotUndefined(qa, { why: "needed" });
    if (isForeign === true) {
      qa.innerText = "Foreign Content";
    } else {
      qa.innerHTML = nativeHtml;
    }
  }
  static part(v: AnkiRecordProps) {
    Object.entries(v).forEach(([part, value]) => {
      this.assign([INPUT_TYPE_CLASS_SELECTOR, part].join("."), value);
    });
  }
  static play(
    p: AnkiPlayFields,
    opts?: { count?: number; delay?: number; duration?: number },
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
        ) as AnkiSetFunc;
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

  /**
   * @dev
   * #1 Ignored for convenience
   */
  static set(p: AnkiSetFunc) {
    Object.entries(p).forEach(([k, v]) => {
      // @ts-expect-error #1
      if (!this[k]) {
        assertNever({
          details: { key: k, value: v },
          why: "No such anki access method",
        });
      }
      // @ts-expect-error #1
      this[k](v);
    });
  }

  static tags = (v: AnkiSetValues) => this.dataType("tags", v);

  static trigger() {
    const qa = document.querySelector("#qa") as HTMLDivElement;
    assertNotUndefined(qa, { why: "needed" });
    const ren = qa.querySelector(RENDERED_CLASS_SELECTOR);
    if (ren) {
      qa.removeChild(ren);
    }
    return qa;
  }

  static type = (v: AnkiSetValues) => this.dataType("type", v);

  private static assign(selector: string, value: AnkiSetValues) {
    const qa = this.trigger();
    const elem = qa.querySelector(selector) as HTMLScriptElement;
    assertNotNull(elem, { details: { selector, value }, why: "needed" });
    elem.innerText = value.toString();
  }

  private static dataType = (type: string, v: AnkiSetValues) => {
    this.assign([DATA_TYPE_CLASS_SELECTOR, type].join("."), v);
  };
}
