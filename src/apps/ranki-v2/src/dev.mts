import { assertNotNull, assertNotUndefined } from "./error/assertions.mts";

type RankiSetKeys = "deck" | "face" | "type" | "tags" | "a" | "b";
type RankiSetValues = string | number;
type RankiSetFunc = Record<RankiSetKeys, RankiSetValues>;

type RankiAlternateFunc = Record<RankiSetKeys, RankiSetValues[]>;

declare global {
  interface Window {
    ranki: {
      trigger(): HTMLDivElement;
      switch(t: string): void;
      face(f: string): void;
      a(a: string): void;
      b(a: string): void;
      tags(f: string): void;
      type(f: string): void;
      flag(f: number): void;
      deck(d: string): void;
      set(p: RankiSetFunc): void;
      alternate(p: RankiAlternateFunc): void;
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
    trigger() {
      const qa = document.querySelector("#qa") as HTMLDivElement;
      assertNotUndefined(qa, { why: "needed" });
      const ren = qa.querySelector("div.rendered");
      if (ren) {
        qa.removeChild(ren);
      }
      return qa;
    },
    switch() {
      this.tags(
        [
          dark ? "+r:scheme-light" : "",
          // !!tagIndex ? "+r:animation-slow" : "",
          // "+r:animation-slow",
          TAGS[tagIndex++ % TAGS.length],
          "+r:animation::disabled",
        ].join(" "),
      );
      dark = !dark;
      this.deck(DECKS[deckIndex++ % DECKS.length]);

      Object.entries(FACES[faceIndex]).forEach(([faceName, text]) => {
        // @ts-expect-error
        this[faceName](text);
      });

      faceIndex = (faceIndex + 1) % FACES.length;
    },
    face(q) {
      const qa = this.trigger();
      const elem = qa.querySelector("script.ranki-v2-data.face");
      assertNotNull(elem, { why: "required" });
      elem.innerHTML = q;
    },
    a(a) {
      const qa = this.trigger();
      const elem = qa.querySelector("script.ranki-v2-input.A");
      assertNotNull(elem, { why: "required" });
      elem.innerHTML = a;
    },
    b(b) {
      const qa = this.trigger();
      const elem = qa.querySelector("script.ranki-v2-input.B");
      assertNotNull(elem, { why: "required" });
      elem.innerHTML = b;
    },
    tags(t) {
      const qa = this.trigger();
      const elem = qa.querySelector(
        "script.ranki-v2-data.tags",
      ) as HTMLScriptElement;
      assertNotNull(elem, { why: "needed" });
      elem.innerText = t;
    },
    deck(d) {
      const qa = this.trigger();
      const elem = qa.querySelector(
        "script.ranki-v2-data.deck",
      ) as HTMLScriptElement;
      assertNotNull(elem, { why: "needed" });
      elem.innerText = d;
    },
    type(d) {
      const qa = this.trigger();
      const elem = qa.querySelector(
        "script.ranki-v2-data.type",
      ) as HTMLScriptElement;
      assertNotNull(elem, { why: "needed" });
      elem.innerText = d;
    },
    flag(f) {
      const qa = this.trigger();
      const elem = qa.querySelector(
        "script.ranki-v2-data.flag",
      ) as HTMLScriptElement;
      assertNotNull(elem, { why: "needed" });
      elem.innerText = "flag" + f.toString();
    },
    set(p) {
      Object.entries(p).forEach(([k, v]) => {
        // @ts-expect-error
        this[k](v);
      });
    },
    alternate(p, opts?: { limit?: number; duration?: number }) {
      let count = 0;
      const limit = opts?.limit || 4;
      const duration = opts?.duration || 2e3;
      let interval: number;

      const cb = () => {
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

      interval = setInterval(cb, duration);
    },
  };
}
