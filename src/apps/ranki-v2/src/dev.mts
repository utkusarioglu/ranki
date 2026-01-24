import { assertExists } from "./error/assertions.mts";
import { RENDERED_CLASS_SELECTOR } from "./selector.constants.mts";

declare global {
  interface Window {
    ranki: {
      switchScheme(t: string): void;
    };
  }
}

export function devMethods() {
  let dark = true;
  let addressIndex = 0;

  window.ranki = {
    switchScheme() {
      const r = document.querySelector(`.${RENDERED_CLASS_SELECTOR}`);
      assertExists(r, { why: "needed" });
      r.classList.remove(RENDERED_CLASS_SELECTOR);
      const tags = document.querySelector(
        "script.ranki-v2-data.tags",
      ) as HTMLScriptElement;
      assertExists(tags, { why: "needed" });
      tags.innerText = [
        dark ? "+r:scheme-light" : "+r:scheme-dark",
        "+r:animation-slow",
      ].join(" ");
      dark = !dark;
      const deck = document.querySelector(
        "script.ranki-v2-data.deck",
      ) as HTMLScriptElement;
      assertExists(deck, { why: "needed" });
      deck.innerText = ["A::B::C::D", "A::B::C", "A", "A::B"][addressIndex++];
    },
  };
}
