import type {
  CardFaceArray,
  DataCollection,
} from "../../collect/collect.types.mts";
import type { RankiComponent } from "../../types/ranki-component.types.mts";
import { createHud } from "../card-hud/main.mts";
import { createVerticalScroller } from "../vertical-scroller/vertical-scroller.mts";
import type { RenderRoots } from "@dqm/package-dqm-v2";

function createFaces(selectedFaces: CardFaceArray): RankiComponent {
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
  };
}

export function createApp(collected: DataCollection, root: HTMLElement) {
  const { theaterOrder: selectedFaces, hud } = collected;
  const scroller = createVerticalScroller(root);
  (scroller.element as HTMLDivElement).classList.add("content-grid");

  const hudNode = createHud(hud);
  const facesNode = createFaces(selectedFaces);
  [hudNode, facesNode].forEach((n) => {
    scroller.element.appendChild(n.element);
  });

  [scroller, hudNode, facesNode]
    .map((n) => n.css)
    .filter((v) => v !== undefined)
    .flat()
    .forEach((c) => {
      const e = document.createElement("style");
      e.id = c.id;
      e.innerHTML = c.css;
      scroller.element.appendChild(e);
    });

  return { roots: facesNode.objects!["faces"], scroller };
}
