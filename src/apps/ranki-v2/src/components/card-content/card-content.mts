import type { DataCollection } from "../../collect/collect.types.mts";
import { cardHud } from "../card-hud/main.mts";
import { createVerticalScroller } from "../vertical-scroller/vertical-scroller.mts";

export function createStructure(collected: DataCollection, root: HTMLElement) {
  const { data, selectedFaces, address, neutralTags, marked } = collected;
  const scroller = createVerticalScroller(root);
  scroller.classList.add("content-grid");

  const hud = cardHud({
    order: ["parser", "card", "address", "review", "tags"],
    parser: {
      hasReplacements: true,
      parseMode: "v2",
      errorLevel: "none",
    },
    address: {
      prefix: [],
      exposed: address,
      suffix: [],
    },
    tags: neutralTags,
    review: {
      marked,
      flag: {
        type: data.flag,
        message: "Some message",
      },
    },
    card: {
      type: data.type,
      face: data.face,
    },
  });

  const faceContainer = document.createElement("div");
  faceContainer.classList.add("ranki-v2-face-container");
  const faces = Object.fromEntries(
    selectedFaces.map((f) => {
      const container = document.createElement("div");
      container.classList.add("face");
      faceContainer.appendChild(container);
      return [f, container];
    }),
  );

  scroller.appendChild(hud.element);
  scroller.appendChild(faceContainer);

  hud.css?.forEach((c) => {
    const e = document.createElement("style");
    e.id = c.id;
    e.innerHTML = c.css;
    scroller.appendChild(e);
  });
  return { faces, scroller };
}
