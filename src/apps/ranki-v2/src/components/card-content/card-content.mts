import type {
  CardFaceArray,
  DataCollection,
} from "../../collect/collect.types.mts";
import type { RankiRenderNode } from "../../types/render-node.mts";
import { cardHud } from "../card-hud/main.mts";
import { createVerticalScroller } from "../vertical-scroller/vertical-scroller.mts";
import type { RenderRoots } from "@dqm/package-dqm-v2";

function createFaceContainer(selectedFaces: CardFaceArray): RankiRenderNode {
  const faceContainer = document.createElement("div");
  faceContainer.classList.add("ranki-v2-face-container");
  const faces: RenderRoots = Object.fromEntries(
    selectedFaces.map((f) => {
      const container = document.createElement("div");
      container.classList.add("face");
      faceContainer.appendChild(container);
      return [f, container];
    }),
  );
  return {
    element: faceContainer,
    objects: {
      faces,
    },
    // element: faces
  };
}

export function createStructure(collected: DataCollection, root: HTMLElement) {
  const { data, selectedFaces, address, neutralTags, marked } = collected;
  const scroller = createVerticalScroller(root);
  (scroller.element as HTMLDivElement).classList.add("content-grid");

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

  const faceContainer = createFaceContainer(selectedFaces);
  scroller.element.appendChild(hud.element);
  scroller.element.appendChild(faceContainer.element);

  [hud.css, scroller.css]
    .filter((v) => v !== undefined)
    .flat()
    .forEach((c) => {
      const e = document.createElement("style");
      e.id = c.id;
      e.innerHTML = c.css;
      scroller.element.appendChild(e);
    });
  // hud.css?.forEach((c) => {
  //   const e = document.createElement("style");
  //   e.id = c.id;
  //   e.innerHTML = c.css;
  //   scroller.element.appendChild(e);
  // });
  return { faces: faceContainer.objects!["faces"], scroller };
}
