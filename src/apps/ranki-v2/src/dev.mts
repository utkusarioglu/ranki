import { assertNotNull, assertNotUndefined } from "./error/assertions.mts";

declare global {
  interface Window {
    ranki: {
      switch(t: string): void;
      face(): void;
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

  const FACES = [
    {
      A: "hi",
      B: "ho",
    },
    {
      A: "hi3",
      B: "hello",
    },
    {
      A: "hi4",
      B: "hello",
    },
  ];
  let faceIndex = 0;

  window.ranki = {
    switch() {
      const qa = document.querySelector("#qa");
      assertNotUndefined(qa, { why: "needed" });
      const face = qa.querySelector("script.ranki-v2-data.face")!.innerHTML;
      const ren = qa.querySelector("div.rendered");
      if (ren) {
        qa.removeChild(ren);
      }
      const tags = document.querySelector(
        "script.ranki-v2-data.tags",
      ) as HTMLScriptElement;
      assertNotUndefined(tags, { why: "needed" });
      tags.innerText = [
        // dark ? "+r:scheme-light" : "",
        // !!tagIndex ? "+r:animation-slow" : "",
        // "+r:animation-slow",
        TAGS[tagIndex++ % TAGS.length],
        "+r:animation::disabled",
      ].join(" ");
      dark = !dark;
      const deck = document.querySelector(
        "script.ranki-v2-data.deck",
      ) as HTMLScriptElement;
      assertNotNull(deck, { why: "needed" });
      deck.innerText = DECKS[deckIndex++ % DECKS.length];

      Object.entries(FACES[faceIndex]).forEach(([faceName, text]) => {
        const f = document.querySelector(
          `script.ranki-v2-input.${faceName}`,
        ) as HTMLScriptElement;
        assertNotNull(f, { why: "needed" });
        f.innerText = text;
      });

      console.log(face, FACES[faceIndex]);
      // const b = document.querySelector(
      //   "script.ranki-v2-input.B",
      // ) as HTMLScriptElement;
      // assertNotNull(b, { why: "needed" });
      // b.innerText = FACES[faceIndex]["B"] || "";
      faceIndex = (faceIndex + 1) % FACES.length;
    },
    face() {
      const qa = document.querySelector("#qa");
      assertNotNull(qa, { why: "needed" });
      const ren = qa.querySelector("div.rendered");
      if (ren) {
        qa.removeChild(ren);
      }
      const face = qa.querySelector("script.ranki-v2-data.face");
      assertNotNull(face, { why: "required" });
      isAnswer = !isAnswer;
      face.innerHTML = isAnswer ? "N" : "Q";

      const tags = document.querySelector(
        "script.ranki-v2-data.tags",
      ) as HTMLScriptElement;
      assertNotUndefined(tags, { why: "needed" });
      tags.innerText = [
        isAnswer ? "+r:scheme-light" : "",
        // !!tagIndex ? "+r:animation-slow" : "",
        "+r:animation-slow",
        // TAGS[tagIndex++ % TAGS.length],
      ].join(" ");
      // dark = !dark;
    },
  };
}
