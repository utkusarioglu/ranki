import "./app.css";
import { createHud } from "../hud/hud.mjs";
import { createVerticalScroller } from "../vertical-scroller/vertical-scroller.mjs";
import { createFaces } from "../faces/faces.mts";
import type { RankiAppConfig } from "../../config/config.types.mts";

export function createApp(config: RankiAppConfig, root: HTMLElement) {
  const scroller = createVerticalScroller(root);
  (scroller.element as HTMLDivElement).classList.add("content-grid");

  const hudNode = createHud(config.hud);
  const facesNode = createFaces(config.order);
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
