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
  let deckIndex = 0;
  const DECKS = [
    "A::B::C::D",
    "Cat::Dog",
    "A::B::C",
    "A",
    "A::B",
    "Cat::Dog::Bunny",
  ];

  let tagIndex = 0;
  const TAGS = [
    "",
    "study",
    "",
    "attention",
    "",
    "caution",
    "dog bunny huny",
    "",
  ];

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
        dark ? "+r:scheme-light" : "",
        // !!tagIndex ? "+r:animation-slow" : "",
        TAGS[tagIndex++ % TAGS.length],
      ].join(" ");
      dark = !dark;
      const deck = document.querySelector(
        "script.ranki-v2-data.deck",
      ) as HTMLScriptElement;
      assertExists(deck, { why: "needed" });
      deck.innerText = DECKS[deckIndex++ % DECKS.length];
    },
  };
}
