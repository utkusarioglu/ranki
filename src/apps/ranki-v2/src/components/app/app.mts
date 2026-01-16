import "./app.css";
import { createHud } from "../hud/hud.mjs";
import { createVerticalScroller } from "../vertical-scroller/vertical-scroller.mjs";
import { createFaces } from "../faces/faces.mts";
import type { RankiAppConfig } from "../../config/config.types.mts";

export function createApp(collected: RankiAppConfig, root: HTMLElement) {
  const { order, hud } = collected;
  const scroller = createVerticalScroller(root);
  (scroller.element as HTMLDivElement).classList.add("content-grid");

  const hudNode = createHud(hud);
  const facesNode = createFaces(order);
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
