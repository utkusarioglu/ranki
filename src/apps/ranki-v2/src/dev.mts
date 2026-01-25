import { assertExists } from "./error/assertions.mts";

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
  let isAnswer = false;
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
      const qa = document.querySelector("#qa");
      assertExists(qa, { why: "needed" });
      const ren = qa.querySelector("div.rendered");
      if (ren) {
        qa.removeChild(ren);
      }
      const tags = document.querySelector(
        "script.ranki-v2-data.tags",
      ) as HTMLScriptElement;
      assertExists(tags, { why: "needed" });
      tags.innerText = [
        dark ? "+r:scheme-light" : "",
        !!tagIndex ? "+r:animation-slow" : "",
        TAGS[tagIndex++ % TAGS.length],
      ].join(" ");
      dark = !dark;
      const deck = document.querySelector(
        "script.ranki-v2-data.deck",
      ) as HTMLScriptElement;
      assertExists(deck, { why: "needed" });
      deck.innerText = DECKS[deckIndex++ % DECKS.length];
      const face = document.querySelector(
        "script.ranki-v2-data.face",
      ) as HTMLScriptElement;
      assertExists(face, { why: "needed" });
      face.innerText = isAnswer ? "N" : "Q";
      isAnswer = !isAnswer;
    },
  };
}
